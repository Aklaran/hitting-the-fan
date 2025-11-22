import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Textarea } from '../ui/textarea'

export const NotepadDialog = ({
  playerNotes,
  onSubmit,
}: {
  playerNotes: string
  onSubmit: (notes: string) => void
}) => {
  const [notes, setNotes] = useState(playerNotes)

  useEffect(() => {
    if (playerNotes !== undefined) {
      setNotes(playerNotes)
    }
  }, [playerNotes])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Notes</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Your Notepad</DialogTitle>
        </DialogHeader>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={1000}
        />
        <DialogFooter>
          {/* FIXME: If the mutation fails, the dialog will close and user won't know */}
          <DialogClose asChild>
            <Button variant="outline" onClick={() => onSubmit(notes)}>
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
