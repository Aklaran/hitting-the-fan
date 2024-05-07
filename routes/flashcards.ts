import { validateData } from '@/middleware/validation'
import express, { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'

const flashcardsRoute: Router = express.Router()

const flashcardSchema = z.object({
  id: z.number().int().positive().min(1),
  question: z.string({ required_error: 'Question is required.' }),
  answer: z.string({ required_error: 'Answer is required.' }),
})

const createFlashcardSchema = flashcardSchema.omit({ id: true })

type Flashcard = z.infer<typeof flashcardSchema>

const fakeFlashcards: Flashcard[] = [
  { id: 1, question: 'What is the capital of France?', answer: 'Paris' },
  { id: 2, question: 'What is the capital of Germany?', answer: 'Berlin' },
]

flashcardsRoute.get('/', (_req, res) => {
  res.json(fakeFlashcards)
})

})

flashcardsRoute.post('/', validateData(createFlashcardSchema), (req, res) => {
  const { question, answer } = createFlashcardSchema.parse(req.body)

  const newFlashcard: Flashcard = {
    id: fakeFlashcards.length + 1,
    question,
    answer,
  }

  fakeFlashcards.push(newFlashcard)

  res.status(StatusCodes.CREATED).json(newFlashcard)
})

export default flashcardsRoute
