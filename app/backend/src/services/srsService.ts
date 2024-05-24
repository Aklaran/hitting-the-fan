import { Context } from '@backend/lib/middleware/context'
import userFlashcardRepository from '@backend/repositories/userFlashcardRepository'
import { StudyFlashcardSchema } from '@shared/types/srs'
import { UserId } from '@shared/types/user'
import { TRPCError } from '@trpc/server'
import fsrsAdapter from '../lib/fsrs'
import { RatingMap } from '../lib/util/prismaEnumMappings'
import flashcardRepository from '../repositories/flashcardRepository'

const initializeSrs = async (userId: UserId, ctx: Context) => {
  // find any UserFlashcards currently existing for the user
  const existingUserFlashcards =
    await userFlashcardRepository.getUserFlashcards(userId, ctx)

  // if there are any, throw an error that the srs system has already been inited.
  // TODO: Handle partial case by adding flashcards to fill the diff between
  //       existing UserFlashcards and number of Flashcards.
  if (existingUserFlashcards.length > 0) {
    // TODO: Should I throw tRPC errors at the service layer, or should I
    //       make my own error types?
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'The SRS system has already been initialized for the user.',
    })
  }

  // otherwise, get all the flashcards in the system
  const flashcardIds = (await flashcardRepository.getFlashcards(ctx)).map(
    (flashcard) => flashcard.id,
  )

  // with a FlashcardSchedule calculated using the defaults in the fsrs lib
  const defaultNewFlashcardSchedule =
    fsrsAdapter.getDefaultNewFlashcardSchedule()

  // and make UserFlashcards for them
  const userFlashcards = await userFlashcardRepository.createUserFlashcards(
    userId,
    flashcardIds,
    defaultNewFlashcardSchedule,
    ctx,
  )

  return userFlashcards
}

const getScheduledCards = async (userId: UserId, ctx: Context) => {
  const userFlashcards = await userFlashcardRepository.getUserFlashcards(
    userId,
    ctx,
  )

  return userFlashcards
}

const getNextScheduledCard = async (userId: UserId, ctx: Context) => {
  const nextScheduledCard = await userFlashcardRepository.getNextScheduledCard(
    userId,
    ctx,
  )

  return nextScheduledCard
}

const studyCard = async (input: StudyFlashcardSchema, ctx: Context) => {
  const { userFlashcardId, grade } = input

  // TODO: Authorization checking

  try {
    // TODO: Is it better to get the userFlashcard here or have the complete info.
    //       Sent in from the endpoint? I'm leaning towards just using IDs at the API level.
    const userFlashcard = await userFlashcardRepository.getUserFlashcard(
      userFlashcardId,
      ctx,
    )

    if (!userFlashcard) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'The UserFlashcard does not exist.',
      })
    }

    const convertedRating = RatingMap[grade]
    const studyLog = fsrsAdapter.studyFlashcard(userFlashcard, convertedRating)
    const newFlashcardSchedule = studyLog.card

    const savedFlashcardSchedule =
      await userFlashcardRepository.updateUserFlashcard(
        userFlashcardId,
        newFlashcardSchedule,
        ctx,
      )

    return savedFlashcardSchedule
  } catch (e) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An error occurred while studying the flashcard.',
      cause: e,
    })
  }
}

const srsService = {
  initializeSrs,
  getScheduledCards,
  getNextScheduledCard,
  studyCard,
}

export default srsService
