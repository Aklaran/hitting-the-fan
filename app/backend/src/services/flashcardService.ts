import { Context } from '@backend/lib/middleware/context'
import flashcardRepository from '@backend/repositories/flashcardRepository'
import {
  CreateFlashcardSchema,
  DeleteFlashcardSchema,
  GetFlashcardSchema,
} from '@shared/types/flashcard'

const createFlashcard = async (input: CreateFlashcardSchema, ctx: Context) => {
  const createdFlashcard = await flashcardRepository.createFlashcard(input, ctx)

  return createdFlashcard
}

const getFlashcards = async (ctx: Context) => {
  const flashcards = await flashcardRepository.getFlashcards(ctx)

  return flashcards
}

const getFlashcard = async (input: GetFlashcardSchema, ctx: Context) => {
  const flashcard = await flashcardRepository.getFlashcard(input, ctx)

  return flashcard
}

const deleteFlashcard = async (input: DeleteFlashcardSchema, ctx: Context) => {
  const flashcard = await flashcardRepository.deleteFlashcard(input, ctx)

  return flashcard
}

export const flashcardService = {
  createFlashcard,
  getFlashcards,
  getFlashcard,
  deleteFlashcard,
}
