import { Button } from '@/components/ui/button'
import { trpc } from '@/lib/trpc'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/flashcards/initialize')({
  component: FlashcardInitialize,
})

function FlashcardInitialize() {
  const navigate = useNavigate()

  const mutation = trpc.srs.initialize.useMutation()

  return (
    <div className="flex justify-center items-center h-screen text-6xl">
      <Button
        onClick={() =>
          mutation.mutate(undefined, {
            onSuccess: () => {
              console.log('success!')
              navigate({ to: '/flashcards/study' })
            },
          })
        }
      >
        Initialize Collection
      </Button>
    </div>
  )
}
