import Flashcard from '@shared/types/flashcard'
import { useEffect, useState } from 'react'
import './App.css'
import { Flashcard as FlashcardDisplay } from './components/custom-ui/flashcard'

function App() {
  const [flashcard, setFlashcard] = useState<Flashcard | null>(null)

  useEffect(() => {
    (async () => {
      const response = await fetch('/api/flashcards/1')
      const flashcard = (await response.json()) as Flashcard
      setFlashcard(flashcard)
    })()
  }, [])

  return (
    <div className="flex flex-col bg-background max-w-md m-auto gap-y-5">
      {flashcard && (
        <FlashcardDisplay
          question={flashcard.question}
          answer={flashcard.answer}
        />
      )}
    </div>
  )
}

export default App
