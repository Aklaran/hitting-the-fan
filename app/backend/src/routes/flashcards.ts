import { protectedProcedure, router } from '@backend/lib/middleware/trpc'
import { Prisma, PrismaClient } from '@prisma/client'
import {
  createFlashcardSchema,
  deleteFlashcardSchema,
  getFlashcardSchema,
} from '@shared/types/flashcard'
import logger from '@shared/util/logger'
import { TRPCError } from '@trpc/server'

// TODO: Pass the Prisma client in tRPC context
// TODO: Also add nice Prisma-related scripts to package.json
const prisma = new PrismaClient()

const flashcardsRouter = router({
  create: protectedProcedure
    .input(createFlashcardSchema)
    .mutation(async (opts) => {
      try {
        const { question, answer } = opts.input

        const newFlashcard: Prisma.FlashcardCreateInput = {
          question: question,
          answer: answer,
        }

        await prisma.flashcard.create({ data: newFlashcard })

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

  list: protectedProcedure.query(async () => {
    return await prisma.flashcard.findMany()
  }),

  get: protectedProcedure.input(getFlashcardSchema).query(async (opts) => {
    const { id } = opts.input
    return await prisma.flashcard.findUnique({ where: { id } })
  }),

  delete: protectedProcedure
    .input(deleteFlashcardSchema)
    .mutation(async (opts) => {
      const { id } = opts.input

      // TODO: Does this automatically handle not found/other errors?
      return await prisma.flashcard.delete({ where: { id } })
    }),
})

export default flashcardsRouter
