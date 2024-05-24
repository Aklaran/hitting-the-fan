import {
  protectedProcedure,
  publicProcedure,
  router,
} from '@backend/lib/clients/trpc'
import {
  createFlashcardSchema,
  deleteFlashcardSchema,
  getFlashcardSchema,
} from '@shared/types/flashcard'
import logger from '@shared/util/logger'
import { TRPCError } from '@trpc/server'
import { flashcardService } from '../services/flashcardService'

const flashcardsRouter = router({
  create: protectedProcedure
    .input(createFlashcardSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const newFlashcard = await flashcardService.createFlashcard(input, ctx)

        return newFlashcard
      } catch (error) {
        logger.error(error)

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while creating the flashcard',
          cause: error,
        })
      }
    }),

  list: publicProcedure.query(async ({ ctx }) => {
    return await flashcardService.getFlashcards(ctx)
  }),

  get: protectedProcedure
    .input(getFlashcardSchema)
    .query(async ({ input, ctx }) => {
      return await flashcardService.getFlashcard(input, ctx)
    }),

  delete: protectedProcedure
    .input(deleteFlashcardSchema)
    .mutation(async ({ input, ctx }) => {
      // TODO: Handle errors
      return await flashcardService.deleteFlashcard(input, ctx)
    }),
})

export default flashcardsRouter
