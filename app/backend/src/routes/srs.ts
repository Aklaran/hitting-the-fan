import { protectedProcedure, router } from '@backend/lib/middleware/trpc'
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

    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You are not authorized to get scheduled cards',
      })
    }

    return await srsService.getScheduledCards(user.id, ctx)
  }),
})

export default srsRouter
