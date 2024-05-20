import {
  protectedProcedure,
  publicProcedure,
  router,
} from '@backend/lib/middleware/trpc'

const usersRouter = router({
  // TODO: Remove this route. This is just to demonstrate that you can get user
  // ctx without being in the protected procedure.
  meButPublic: publicProcedure.query(async ({ ctx }) => {
    return ctx.user
  }),

  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.user
  }),
})

export default usersRouter
