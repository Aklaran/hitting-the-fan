import { initTRPC } from '@trpc/server'

const trpc = initTRPC.create()

export const router = trpc.router
export const publicProcedure = trpc.procedure

// created for each request
// TODO: Add context (like auth'd user) in the future
export const createContext = () => ({}) // no context
