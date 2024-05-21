import { protectedProcedure, router } from '@backend/lib/middleware/trpc'
import { Prisma, PrismaClient } from '@prisma/client'
import {
  createFlashcardSchema,
  deleteFlashcardSchema,
  getFlashcardSchema,
} from '@shared/types/flashcard'

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
        console.error(error)
        return { error: 'An error occurred while creating the flashcard' }
      }
    }),

  list: protectedProcedure.query(async () => {
    return await prisma.flashcard.findMany()
  }),

  // TODO: Convert route param to GUID
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
