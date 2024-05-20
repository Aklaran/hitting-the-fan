import { TRPCError, initTRPC } from '@trpc/server'
import { Context } from './context'

const trpc = initTRPC.context<Context>().create()

// TODO: Add authorization checks as well
// Maybe use CASL?
// Maybe just use Kinde's built-in stuff?
const isAuthenticated = trpc.middleware(async ({ ctx, next }) => {
  if (!ctx.isAuthenticated) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to perform this action',
    })
  }

  return next({
    ctx: {
      isAuthenticated: ctx.isAuthenticated,
      user: ctx.user,
    },
  })
})

export const router = trpc.router

export const publicProcedure = trpc.procedure
export const protectedProcedure = trpc.procedure.use(isAuthenticated)
