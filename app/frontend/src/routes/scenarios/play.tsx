import { GradeDialog } from '@/components/custom-ui/gradeDialog'
import { InventoryDialog } from '@/components/custom-ui/inventoryDialog'
import { NotepadDialog } from '@/components/custom-ui/notepadDialog'
import { ScenarioLogOutput } from '@/components/custom-ui/scenarioLogOutput'
import { ScenarioPlayerInput } from '@/components/custom-ui/scenarioPlayerInput'
import { SoapNoteDialog } from '@/components/custom-ui/soapNoteDialog'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { trpc } from '@/lib/trpc'
import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState } from 'react'

function ScenarioPlayPage() {
  const {
    data: scenarioState,
    isLoading,
    isError,
  } = trpc.scenario.getSessionState.useQuery()

  const trpcUtils = trpc.useUtils()

  const gameActionMutation = trpc.scenario.processAction.useMutation({
    onSuccess: () => {
      trpcUtils.scenario.getSessionState.invalidate()

      scrollLogContainer()
    },
  })

  const playerNotesMutation = trpc.scenario.updatePlayerNotes.useMutation({
    onSuccess: () => {
      trpcUtils.scenario.getSessionState.invalidate()
    },
  })

  const soapNoteMutation = trpc.scenario.updateSoapNote.useMutation({
    onSuccess: () => {
      trpcUtils.scenario.getSessionState.invalidate()
    },
  })

  const resetMutation = trpc.scenario.deleteSession.useMutation({
    onSuccess: () => {
      trpcUtils.scenario.getSessionState.invalidate()
    },
  })

  const finishMutation = trpc.scenario.finish.useMutation({
    onSuccess: () => {
      trpcUtils.scenario.getSessionState.invalidate()
      setIsGradeDialogOpen(true)
    },
  })

  const [isGradeDialogOpen, setIsGradeDialogOpen] = useState(false)

  useKeyboardShortcuts({
    'ctrl+r': () => {
      resetMutation.mutate()
    },
  })

  const logContainerRef = useRef<HTMLDivElement>(null)

  if (isError) {
    return <div>Error</div>
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!scenarioState) {
    return <div>Error - no data</div>
  }

  const handlePlayerInput = async (value: { action: string }) => {
    gameActionMutation.mutate({ action: value.action })
  }

  const handlePlayerNotesSubmit = (notes: string) => {
    playerNotesMutation.mutate({ notes: notes })
  }

  const handleSoapNoteSubmit = (soapNote: string) => {
    soapNoteMutation.mutate({ soapNote: soapNote })
  }

  const handleFinish = () => {
    finishMutation.mutate()
  }

  const scrollLogContainer = () => {
    // Timeout needed to allow state to update & re-render before scroll
    setTimeout(() => {
      if (logContainerRef.current) {
        logContainerRef.current.scrollTo({
          top: logContainerRef.current.scrollHeight,
          behavior: 'smooth',
        })
      }
    }, 100)
  }

  return (
    <div className="pt-2">
      <div className="flex flex-col justify-between gap-2 border rounded p-2 w-5/6 h-96 max-h-dvh mx-auto">
        <ScenarioLogOutput
          scenarioLog={scenarioState.log}
          logContainerRef={logContainerRef}
        />

        <ScenarioPlayerInput onSubmit={handlePlayerInput} autoFocus={true} />
      </div>
      <ButtonGroup className="w-5/6 mx-auto mt-4">
        <ButtonGroup>
          <Button
            variant="destructive"
            onClick={() => {
              resetMutation.mutate()
            }}
          >
            Reset
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <InventoryDialog inventory={scenarioState.player.inventory} />
        </ButtonGroup>
        <ButtonGroup>
          <NotepadDialog
            playerNotes={scenarioState.player.notes}
            onSubmit={handlePlayerNotesSubmit}
          />
          <SoapNoteDialog
            note={scenarioState.player.soapNote}
            onSubmit={handleSoapNoteSubmit}
          />
        </ButtonGroup>
        <ButtonGroup>
          <GradeDialog
            grade={scenarioState.grade}
            onOpen={handleFinish}
            open={isGradeDialogOpen}
            onOpenChange={setIsGradeDialogOpen}
          />
        </ButtonGroup>
      </ButtonGroup>
    </div>
  )
}

export const Route = createFileRoute('/scenarios/play')({
  component: ScenarioPlayPage,
})
