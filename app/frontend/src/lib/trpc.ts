import type AppRouter from '@shared/types/trpc'
import { createTRPCReact, httpBatchLink } from '@trpc/react-query'

export const trpc = createTRPCReact<AppRouter>()

export const trpcClient = trpc.createClient({
  links: [httpBatchLink({ url: '/api/trpc' })],
})
