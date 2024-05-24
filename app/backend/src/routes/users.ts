import {
  protectedProcedure,
  publicProcedure,
  router,
} from '@backend/lib/clients/trpc'

const usersRouter = router({
  isAuthenticated: publicProcedure.query(async ({ ctx }) => {
    return ctx.isAuthenticated
  }),

  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.user
  }),
})

export default usersRouter
