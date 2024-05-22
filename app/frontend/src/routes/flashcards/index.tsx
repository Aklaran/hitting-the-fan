import Button from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
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
import { Link, createFileRoute } from '@tanstack/react-router'

function Flashcards() {
  const { data, isPending } = trpc.flashcard.list.useQuery()

  // TODO: Lol if only I had this in context. Can always give it another try!
  const isAuthenticatedQuery = trpc.user.isAuthenticated.useQuery()

  if (isAuthenticatedQuery.isError) {
    console.error('Error in AuthenticatedComponent', isAuthenticatedQuery.error)
  }

  return (
    <>
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
            <TableSkeleton />
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

const TableSkeleton = () => {
  return Array(3)
    .fill(0)
    .map((_, i) => (
      <TableRow key={i}>
        <TableCell className="font-medium">
          <Skeleton className="h-4" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4" />
        </TableCell>
      </TableRow>
    ))
}

export const Route = createFileRoute('/flashcards/')({
  component: Flashcards,
})