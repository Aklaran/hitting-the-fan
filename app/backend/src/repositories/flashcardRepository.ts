import {
  CreateFlashcardSchema,
  DeleteFlashcardSchema,
  GetFlashcardSchema,
} from '@shared/types/flashcard'
import { Context } from '../lib/middleware/context'

const createFlashcard = async (input: CreateFlashcardSchema, ctx: Context) => {
  const flashcard = await ctx.prisma.flashcard.create({
    data: input,
  })

  return flashcard
}

const getFlashcards = async (ctx: Context) => {
  const flashcards = await ctx.prisma.flashcard.findMany()

  return flashcards
}

const getFlashcard = async (input: GetFlashcardSchema, ctx: Context) => {
  const flashcard = await ctx.prisma.flashcard.findUnique({
    where: { id: input.id },
  })

  return flashcard
}

const deleteFlashcard = async (input: DeleteFlashcardSchema, ctx: Context) => {
  const flashcard = await ctx.prisma.flashcard.delete({
    where: { id: input.id },
  })

  return flashcard
}

const flashcardRepository = {
  createFlashcard,
  getFlashcards,
  getFlashcard,
  deleteFlashcard,
}

export default flashcardRepository
