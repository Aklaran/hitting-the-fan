import {
  protectedProcedure,
  publicProcedure,
  router,
} from '@backend/lib/clients/trpc'
import { userService } from '@backend/services/userService'
import { createUserSchema } from '@shared/types/user'
import logger from '@shared/util/logger'
import { TRPCError } from '@trpc/server'

const usersRouter = router({
  isAuthenticated: publicProcedure.query(async ({ ctx }) => {
    return ctx.isAuthenticated
  }),

  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.user
  }),

  create: protectedProcedure
    .input(createUserSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const newUser = await userService.createUser(input, ctx)

        return newUser
      } catch (error) {
        logger.error(error)

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while creating the user',
          cause: error,
        })
      }
    }),
})

export default usersRouter
