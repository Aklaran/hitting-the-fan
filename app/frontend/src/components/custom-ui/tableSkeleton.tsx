import { Skeleton } from '../ui/skeleton'
import { TableCell, TableRow } from '../ui/table'

const TableSkeleton = ({ rows }: { rows: number }) => {
  return (
    <>
      {Array(rows)
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
        ))}
    </>
  )
}

export default TableSkeleton
