import { Context } from '@backend/lib/middleware/context'
import userFlashcardRepository from '@backend/repositories/userFlashcardRepository'
import { UserId } from '@shared/types/user'
import { TRPCError } from '@trpc/server'
import fsrsAdapter from '../lib/fsrs'
import flashcardRepository from '../repositories/flashcardRepository'

const initializeSrs = async (userId: UserId, ctx: Context) => {
  // find any UserFlashcards currently existing for the user
  const existingUserFlashcards =
    await userFlashcardRepository.getUserFlashcards(userId, ctx)

  // if there are any, throw an error that the srs system has already been inited.
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

const srsService = {
  initializeSrs,
  getScheduledCards,
}

export default srsService
