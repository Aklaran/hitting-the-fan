import { trpc } from '@/lib/trpc'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/flashcards/study')({
  component: FlashcardStudy,
})

function FlashcardStudy() {
  const navigate = useNavigate()

  const {
    data: flashcards,
    isLoading,
    isError,
  } = trpc.srs.getScheduledCards.useQuery()

  if (isError) {
    return <div>Error</div>
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!flashcards || flashcards.length === 0) {
    navigate({ to: '/flashcards/initialize' })
  }

  return <div>{flashcards!.map((flashcard) => flashcard.id)}</div>
}
