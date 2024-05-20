import { router } from '@backend/lib/middleware/trpc'
import flashcardsRouter from './flashcards'
import usersRouter from './users'

const appRouter = router({
  flashcard: flashcardsRouter,
  user: usersRouter,
})

export default appRouter
export type AppRouter = typeof appRouter
