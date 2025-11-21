import { trpc } from '@/lib/trpc'
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

export const NotepadDialog = () => {
  // TODO: Pass note state in as props
  const {
    data: playerNotes,
    isLoading,
    isError,
  } = trpc.scenario.getPlayerNotes.useQuery()

  const [notes, setNotes] = useState(playerNotes || '')

  useEffect(() => {
    if (playerNotes !== undefined) {
      setNotes(playerNotes)
    }
  }, [playerNotes])

  const trpcUtils = trpc.useUtils()

  // TODO: Rate limiting?
  const mutation = trpc.scenario.updatePlayerNotes.useMutation({
    onSuccess: () => {
      trpcUtils.scenario.getPlayerNotes.invalidate()
    },
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Notes</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Your Notepad</DialogTitle>
        </DialogHeader>
        {isError ? (
          <div>Error</div>
        ) : (
          <>
            {/* TODO: Add a character counter */}
            <Textarea
              placeholder={isLoading ? 'Loading...' : 'Take any notes here'}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isLoading}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  onClick={() => mutation.mutate({ notes: notes })}
                  disabled={isLoading || mutation.isPending}
                >
                  Save
                </Button>
              </DialogClose>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
