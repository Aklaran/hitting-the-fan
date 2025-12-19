import TableSkeleton from '@/components/custom-ui/tableSkeleton'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { trpc } from '@/lib/trpc'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'

function Flashcards() {
  const { data, isPending } = trpc.flashcard.list.useQuery()
  const navigate = useNavigate()
  const trpcUtils = trpc.useUtils()

  // TODO: Lol if only I had this in context. Can always give it another try!
  const isAuthenticatedQuery = trpc.user.isAuthenticated.useQuery()
  const { data: scheduledCards } = trpc.srs.getScheduledCards.useQuery()
  const initializeMutation = trpc.srs.initialize.useMutation()

  if (isAuthenticatedQuery.isError) {
    console.error('Error in AuthenticatedComponent', isAuthenticatedQuery.error)
  }

  const handleStartStudying = async () => {
    const isInitialized = scheduledCards && scheduledCards.length > 0

    if (!isInitialized) {
      try {
        await initializeMutation.mutateAsync(undefined)
        // Refetch the query to ensure it's up to date before navigating
        await trpcUtils.srs.getScheduledCards.refetch()
      } catch (error: any) {
        // If already initialized (BAD_REQUEST from backend), that's fine, just proceed
        // Otherwise, log the error but still try to navigate
        if (error?.data?.code !== 'BAD_REQUEST') {
          console.error('Error initializing:', error)
        }
      }
    }

    navigate({ to: '/flashcards/study' })
  }

  return (
    <>
      <div className="flex flex-col items-center gap-4 mb-8">
        <Button
          onClick={handleStartStudying}
          disabled={initializeMutation.isPending}
          size="lg"
        >
          {initializeMutation.isPending ? 'Initializing...' : 'Start Studying'}
        </Button>
      </div>

      <Table className="max-w-3xl m-auto">
        <TableCaption>All of the flashcards we currently support.</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Question</TableHead>
            <TableHead>Answer</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isPending || !data ? (
            <TableSkeleton rows={3} />
          ) : (
            data.map((flashcard) => (
              <TableRow key={flashcard.id}>
                <TableCell className="font-medium">{flashcard.id}</TableCell>
                <TableCell>{flashcard.question}</TableCell>
                <TableCell>{flashcard.answer}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {isAuthenticatedQuery.data && (
        <Link to="/flashcards/new">
          <Button>Create Flashcard</Button>
        </Link>
      )}
    </>
  )
}

export const Route = createFileRoute('/flashcards/')({
  component: Flashcards,
})
