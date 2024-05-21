import { protectedProcedure, router } from '@backend/lib/middleware/trpc'
import { Prisma } from '@prisma/client'
import {
  createFlashcardSchema,
  deleteFlashcardSchema,
  getFlashcardSchema,
} from '@shared/types/flashcard'
import logger from '@shared/util/logger'
import { TRPCError } from '@trpc/server'

const flashcardsRouter = router({
  create: protectedProcedure
    .input(createFlashcardSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { question, answer } = input

        const newFlashcard: Prisma.FlashcardCreateInput = {
          question: question,
          answer: answer,
        }

        await ctx.prisma.flashcard.create({ data: newFlashcard })

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

  list: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.flashcard.findMany()
  }),

  get: protectedProcedure
    .input(getFlashcardSchema)
    .query(async ({ input, ctx }) => {
      const { id } = input
      return await ctx.prisma.flashcard.findUnique({ where: { id } })
    }),

  delete: protectedProcedure
    .input(deleteFlashcardSchema)
    .mutation(async ({ input, ctx }) => {
      const { id } = input

      // TODO: Does this automatically handle not found/other errors?
      return await ctx.prisma.flashcard.delete({ where: { id } })
    }),
})

export default flashcardsRouter
