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

export const SoapNoteDialog = ({
  note,
  onSubmit,
}: {
  note: string
  onSubmit: (note: string) => void
}) => {
  const [soapNote, setSoapNote] = useState(note)

  useEffect(() => {
    if (soapNote !== undefined) {
      setSoapNote(soapNote)
    }
  }, [soapNote])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">SOAP Note</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Your SOAP Note</DialogTitle>
        </DialogHeader>
        <Textarea
          value={soapNote}
          onChange={(e) => setSoapNote(e.target.value)}
          maxLength={1000}
        />
        <DialogFooter>
          {/* FIXME: If the mutation fails, the dialog will close and user won't know */}
          <DialogClose asChild>
            <Button variant="outline" onClick={() => onSubmit(soapNote)}>
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
