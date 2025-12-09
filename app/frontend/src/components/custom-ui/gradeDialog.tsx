import { Grade } from '@shared/types/scenario/grade'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'

export const GradeDialog = ({
  grade,
  onOpen,
  open,
  onOpenChange,
}: {
  grade: Grade | null
  onOpen: () => void
  open: boolean
  onOpenChange: (open: boolean) => void
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Button onClick={onOpen} variant="outline">
        Finish
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Your Grade</DialogTitle>
        </DialogHeader>
        <p>Grade: {grade?.grade ?? 'No grade available'}</p>
        <p>Feedback: {grade?.feedback ?? 'No feedback available'}</p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
