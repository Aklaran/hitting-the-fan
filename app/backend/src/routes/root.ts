import { router } from '@backend/lib/clients/trpc'
import flashcardsRouter from './flashcards'
import scenariosRouter from './scenarios'
import srsRouter from './srs'
import usersRouter from './users'

const appRouter = router({
  flashcard: flashcardsRouter,
  user: usersRouter,
  srs: srsRouter,
  scenario: scenariosRouter,
})

export default appRouter
export type AppRouter = typeof appRouter
