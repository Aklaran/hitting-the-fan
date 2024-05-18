import type AppRouter from '@shared/types/trpc'
import { createTRPCReact } from '@trpc/react-query'

export const trpc = createTRPCReact<AppRouter>()
