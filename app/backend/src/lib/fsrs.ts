import { FlashcardSchedule } from '@shared/types/flashcardSchedule'
import { createEmptyCard } from 'ts-fsrs'

const getDefaultNewFlashcardSchedule = () => {
  const now = new Date()
  const schedule: FlashcardSchedule = createEmptyCard(now)

  return schedule
}

const fsrsAdapter = {
  getDefaultNewFlashcardSchedule,
}

export default fsrsAdapter
