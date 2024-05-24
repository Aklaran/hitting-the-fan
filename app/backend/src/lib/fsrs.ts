import { UserFlashcard } from '@prisma/client'
import { FlashcardSchedule } from '@shared/types/srs'
import { TRPCError } from '@trpc/server'
import { Rating, createEmptyCard, fsrs } from 'ts-fsrs'

const getDefaultNewFlashcardSchedule = () => {
  const now = new Date()
  const schedule: FlashcardSchedule = createEmptyCard(now)

  return schedule
}

const studyFlashcard = (userFlashcard: UserFlashcard, rating: Rating) => {
  // TODO: Initialize this once or pass as context
  const f = fsrs()

  if (rating === Rating.Manual) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Manual rating is not allowed for this operation.',
    })
  }

  const nextSchedule = f.repeat(userFlashcard, new Date())[rating]

  return nextSchedule
}

const fsrsAdapter = {
  getDefaultNewFlashcardSchedule,
  studyFlashcard,
}

export default fsrsAdapter
