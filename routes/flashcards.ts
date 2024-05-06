import express, { Router } from "express";

const flashcardsRoute: Router = express.Router();

type Flashcard = {
  id: number;
  question: string;
  answer: string;
};

const fakeFlashcards: Flashcard[] = [
  { id: 1, question: "What is the capital of France?", answer: "Paris" },
  { id: 2, question: "What is the capital of Germany?", answer: "Berlin" },
];

flashcardsRoute.get("/", (_req, res) => {
  res.json({ flashcards: fakeFlashcards });
});

flashcardsRoute.post("/", (req, res) => {
  const { question, answer } = req.body;

  const newFlashcard: Flashcard = {
    id: fakeFlashcards.length + 1,
    question,
    answer,
  };

  fakeFlashcards.push(newFlashcard);

  res.status(201).json(newFlashcard);
});

export default flashcardsRoute;
