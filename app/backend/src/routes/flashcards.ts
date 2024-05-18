import { publicProcedure, router } from '@backend/lib/middleware/trpc'
import Flashcard, {
  createFlashcardSchema,
  deleteFlashcardSchema,
  getFlashcardSchema,
} from '@shared/types/flashcard'

const fakeFlashcards: Flashcard[] = [
  { id: 1, question: 'What is the capital of France?', answer: 'Paris' },
  { id: 2, question: 'What is the capital of Germany?', answer: 'Berlin' },
]

const flashcardsRouter = router({
  create: publicProcedure.input(createFlashcardSchema).mutation((opts) => {
    const { question, answer } = opts.input

    const newFlashcard: Flashcard = {
      id: fakeFlashcards.length + 1,
      question,
      answer,
    }

    // TODO: Integrate database
    fakeFlashcards.push(newFlashcard)

    return newFlashcard
  }),

  list: publicProcedure.query(() => {
    return fakeFlashcards
  }),

  // TODO: Convert route param to GUID
  get: publicProcedure.input(getFlashcardSchema).query((opts) => {
    const { id } = opts.input
    return fakeFlashcards.find((flashcard) => flashcard.id === id)
  }),

  delete: publicProcedure.input(deleteFlashcardSchema).mutation((opts) => {
    const { id } = opts.input
    const index = fakeFlashcards.findIndex((flashcard) => flashcard.id === id)
    if (index === -1) {
      // TODO: Status codes?
      return { error: 'Flashcard not found' }
    }
    fakeFlashcards.splice(index, 1)
    return { message: 'Flashcard deleted successfully' }
  }),
})

export default flashcardsRouter
