import express, { Router } from 'express'
import { z } from 'zod'

const flashcardsRoute: Router = express.Router()

type Flashcard = {
  id: number
  question: string
  answer: string
}

const fakeFlashcards: Flashcard[] = [
  { id: 1, question: 'What is the capital of France?', answer: 'Paris' },
  { id: 2, question: 'What is the capital of Germany?', answer: 'Berlin' },
]

const createFlashcardSchema = z.object({
  question: z.string(),
  answer: z.string(),
})

flashcardsRoute.get('/', (_req, res) => {
  res.json({ flashcards: fakeFlashcards })
})

flashcardsRoute.post('/', (req, res) => {
  const { question, answer } = createFlashcardSchema.parse(req.body)

  const newFlashcard: Flashcard = {
    id: fakeFlashcards.length + 1,
    question,
    answer,
  }

  fakeFlashcards.push(newFlashcard)

  res.status(201).json(newFlashcard)
})

export default flashcardsRoute