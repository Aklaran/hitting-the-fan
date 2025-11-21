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
import { createFileRoute, Link } from '@tanstack/react-router'

function Scenarios() {
  const { data, isPending } = trpc.scenario.list.useQuery()

  // TODO: Lol if only I had this in context. Can always give it another try!
  const isAuthenticatedQuery = trpc.user.isAuthenticated.useQuery()

  if (isAuthenticatedQuery.isError) {
    console.error('Error in AuthenticatedComponent', isAuthenticatedQuery.error)
  }

  return (
    <>
      <Table className="max-w-3xl m-auto">
        <TableCaption>All of the scenarios we currently support.</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Opening Prompt</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isPending || !data ? (
            <TableSkeleton rows={3} />
          ) : (
            data.map((scenario) => (
              <TableRow key={scenario.id}>
                <TableCell className="font-medium">{scenario.id}</TableCell>
                <TableCell>{scenario.title}</TableCell>
                <TableCell>{scenario.openingPrompt}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {isAuthenticatedQuery.data && (
        <Link to="/scenarios/new">
          <Button>Create Scenario</Button>
        </Link>
      )}
    </>
  )
}

export const Route = createFileRoute('/scenarios/')({
  component: Scenarios,
})
