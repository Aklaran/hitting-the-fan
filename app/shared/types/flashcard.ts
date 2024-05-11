import { z } from 'zod'

const flashcardSchema = z.object({
  id: z.number().int().positive().min(1),
  question: z.string({ required_error: 'Question is required.' }),
  answer: z.string({ required_error: 'Answer is required.' }),
})

export const createFlashcardSchema = flashcardSchema.omit({ id: true })

type Flashcard = z.infer<typeof flashcardSchema>

export default Flashcard