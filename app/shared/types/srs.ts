import { Card } from 'ts-fsrs'
import { z } from 'zod'

// HACK: Used to get around annoying type export issues to the frontend.
export enum MyGrade {
  Again = 1,
  Hard = 2,
  Good = 3,
  Easy = 4,
}

// TODO: Move to be with a consolidated UserFlashcard type
//       Prisma Zod generation would really help with that...
export const userFlashcardId = z.number()
export type UserFlashcardId = z.infer<typeof userFlashcardId>

export const studyFlashcardSchema = z.object({
  userFlashcardId: userFlashcardId,
  grade: z.nativeEnum(MyGrade),
})

export type StudyFlashcardSchema = z.infer<typeof studyFlashcardSchema>
export type FlashcardSchedule = Card
