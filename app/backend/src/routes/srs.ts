import { protectedProcedure, router } from '@backend/lib/clients/trpc'
import { studyFlashcardSchema } from '@shared/types/srs'
import { TRPCError } from '@trpc/server'
import srsService from '../services/srsService'

const srsRouter = router({
  initialize: protectedProcedure.mutation(async ({ ctx }) => {
    const { user } = ctx

    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You are not authorized to initialize SRS',
      })
    }

    try {
      return await srsService.initializeSrs(user.id, ctx)
    } catch (error) {
      console.error('Error initializing SRS:', error)

      if (error instanceof TRPCError) {
        throw error
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred while initializing SRS',
        cause: error,
      })
    }
  }),

  getScheduledCards: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx

    // TODO: Is there a way that I could not force-unwrap user
    //       in a protected route?
    return await srsService.getScheduledCards(user!.id, ctx)
  }),

  getNextScheduledCard: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx

    return await srsService.getNextScheduledCard(user!.id, ctx)
  }),

  studyCard: protectedProcedure
    .input(studyFlashcardSchema)
    .mutation(async ({ ctx, input }) => {
      return await srsService.studyCard(input, ctx)
    }),
})

export default srsRouter
