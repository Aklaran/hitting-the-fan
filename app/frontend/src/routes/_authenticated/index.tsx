import { Flashcard } from '@/components/custom-ui/flashcard'
import { trpc } from '@/lib/trpc'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/')({
  component: Index,
})

function Index() {
  const flashcardQuery = trpc.flashcard.get.useQuery({ id: 1 })

  return (
    flashcardQuery.data && (
      <Flashcard
        question={flashcardQuery.data?.question}
        answer={flashcardQuery.data?.answer}
      />
    )
  )
}
