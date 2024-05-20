import type AppRouter from '@shared/types/trpc'
import { createTRPCReact, httpBatchLink } from '@trpc/react-query'

export const trpc = createTRPCReact<AppRouter>()

export const trpcClient = trpc.createClient({
  // TODO: Use environment variable
  links: [httpBatchLink({ url: 'http://localhost:5173/api/trpc' })],
})
