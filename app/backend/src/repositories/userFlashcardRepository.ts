import { Context } from '@backend/lib/middleware/context'
import { FlashcardId } from '@shared/types/flashcard'
import { FlashcardSchedule } from '@shared/types/flashcardSchedule'
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

const userFlashcardRepository = {
  getUserFlashcards,
  createUserFlashcards,
}

export default userFlashcardRepository
