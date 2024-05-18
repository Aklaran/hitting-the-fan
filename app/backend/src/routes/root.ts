import { router } from '@backend/lib/middleware/trpc'
import flashcardsRouter from './flashcards'

const appRouter = router({
  flashcard: flashcardsRouter,
})

export default appRouter
export type AppRouter = typeof appRouter
