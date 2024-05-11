import { validateData } from '@backend/lib/middleware/validation'
import Flashcard, { createFlashcardSchema } from '@shared/types/flashcard'
import express, { Router } from 'express'
import { StatusCodes } from 'http-status-codes'

const flashcardsRoute: Router = express.Router()

const fakeFlashcards: Flashcard[] = [
  { id: 1, question: 'What is the capital of France?', answer: 'Paris' },
  { id: 2, question: 'What is the capital of Germany?', answer: 'Berlin' },
]

flashcardsRoute.get('/', (_req, res) => {
  res.json(fakeFlashcards)
})

// TODO: Convert route param to GUID
flashcardsRoute.get('/:id(\\d+)', (req, res) => {
  const id = Number(req.params.id)

  const flashcard = fakeFlashcards.find((flashcard) => flashcard.id === id)

  if (!flashcard) {
    res.send(StatusCodes.NOT_FOUND)
  } else {
    res.status(StatusCodes.OK).json(flashcard)
  }
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

// TODO: Convert route param to GUID
flashcardsRoute.delete('/:id(\\d+)', (req, res) => {
  const id = Number(req.params.id)

  const index = fakeFlashcards.findIndex((flashcard) => flashcard.id === id)

  if (index === -1) {
    res.send(StatusCodes.NOT_FOUND)
  } else {
    const deletedFlashcard = fakeFlashcards.splice(index, 1)[0]

    res.status(StatusCodes.OK).json(deletedFlashcard)
  }
})

export default flashcardsRoute
