import { protectedProcedure, router } from '@backend/lib/middleware/trpc'

const usersRouter = router({
  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.user
  }),
})

export default usersRouter
