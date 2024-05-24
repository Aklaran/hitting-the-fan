import { Context } from '@backend/lib/middleware/context'
import { FlashcardId } from '@shared/types/flashcard'
import { FlashcardSchedule, UserFlashcardId } from '@shared/types/srs'
import { UserId } from '@shared/types/user'
import { FlashcardStateReverseMap } from '../lib/util/prismaEnumMappings'

const createUserFlashcards = async (
  userId: UserId,
  flashcardIds: FlashcardId[],
  schedule: FlashcardSchedule,
  ctx: Context,
) => {
  const convertedState = FlashcardStateReverseMap[schedule.state]

  const userFlashcards = flashcardIds.map((flashcard) => ({
    ...schedule,
    userId,
    flashcardId: flashcard,
    state: convertedState,
  }))

  return await ctx.prisma.userFlashcard.createMany({
    data: userFlashcards,
  })
}

const getUserFlashcards = async (userId: string, ctx: Context) => {
  return await ctx.prisma.userFlashcard.findMany({
    where: { userId },
    orderBy: {
      due: 'asc',
    },
  })
}

const getUserFlashcard = async (
  userFlashcardId: UserFlashcardId,
  ctx: Context,
) => {
  return await ctx.prisma.userFlashcard.findUnique({
    where: { id: userFlashcardId },
  })
}

const getNextScheduledCard = async (userId: UserId, ctx: Context) => {
  return await ctx.prisma.userFlashcard.findFirst({
    where: { userId },
    include: { flashcard: true },
    orderBy: { due: 'asc' },
  })
}

const updateUserFlashcard = async (
  userFlashcardId: UserFlashcardId,
  newSchedule: FlashcardSchedule,
  ctx: Context,
) => {
  const convertedState = FlashcardStateReverseMap[newSchedule.state]

  return await ctx.prisma.userFlashcard.update({
    where: { id: userFlashcardId },
    data: {
      ...newSchedule,
      state: convertedState,
    },
  })
}

const userFlashcardRepository = {
  createUserFlashcards,
  getUserFlashcards,
  getUserFlashcard,
  getNextScheduledCard,
  updateUserFlashcard,
}

export default userFlashcardRepository
