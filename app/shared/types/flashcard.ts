import { z } from 'zod'

// TODO: Generate with Prisma Zod Generator maybe?
// https://github.com/omar-dulaimi/prisma-zod-generator
const flashcardSchema = z.object({
  id: z.number().int().positive().min(1),
  question: z.string({ required_error: 'Question is required.' }).min(3, {
    message: 'Question must be at least 3 characters long.',
  }),
  answer: z.string({ required_error: 'Answer is required.' }).min(3, {
    message: 'Answer must be at least 3 characters long.',
  }),
})

export const createFlashcardSchema = flashcardSchema.omit({ id: true })
export const getFlashcardSchema = flashcardSchema.pick({ id: true })
export const deleteFlashcardSchema = flashcardSchema.pick({ id: true })

type Flashcard = z.infer<typeof flashcardSchema>
export type CreateFlashcardSchema = z.infer<typeof createFlashcardSchema>
export type GetFlashcardSchema = z.infer<typeof getFlashcardSchema>
export type DeleteFlashcardSchema = z.infer<typeof deleteFlashcardSchema>

export default Flashcard
