import { router } from '@backend/lib/middleware/trpc'
import flashcardsRouter from './flashcards'
import srsRouter from './srs'
import usersRouter from './users'

const appRouter = router({
  flashcard: flashcardsRouter,
  user: usersRouter,
  srs: srsRouter,
})

export default appRouter
export type AppRouter = typeof appRouter
