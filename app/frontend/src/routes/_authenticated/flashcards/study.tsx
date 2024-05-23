import Button from '@/components/ui/button'
import { trpc } from '@/lib/trpc'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/flashcards/study')({
  component: FlashcardStudy,
})

function FlashcardStudy() {
  const {
    data: flashcards,
    isLoading,
    isError,
  } = trpc.srs.getScheduledCards.useQuery()

  const mutation = trpc.srs.initialize.useMutation({
    // TODO: Either invalidate the query or move creation button to a child component
    //       and redirect to the study page on success
    // onSuccess: () => {
    //   trpc.srs.getScheduledCards.invalidate()
    // },
  })

  if (isError) {
    return <div>Error</div>
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-6xl">
        <Button onClick={() => mutation.mutate()}>Start Studying</Button>
      </div>
    )
  }

  return <div>{flashcards.map((flashcard) => flashcard.id)}</div>
}
