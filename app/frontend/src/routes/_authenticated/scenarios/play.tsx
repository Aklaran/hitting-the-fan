import { ScenarioLogOutput } from '@/components/custom-ui/scenarioLogOutput'
import { ScenarioPlayerInput } from '@/components/custom-ui/scenarioPlayerInput'
import { trpc } from '@/lib/trpc'
import { createFileRoute } from '@tanstack/react-router'
import { useRef } from 'react'

function ScenarioPlayPage() {
  const {
    data: scenarioLog,
    isLoading,
    isError,
  } = trpc.scenario.getSessionState.useQuery()

  const trpcUtils = trpc.useUtils()

  const mutation = trpc.scenario.processAction.useMutation({
    onSuccess: () => {
      trpcUtils.scenario.getSessionState.invalidate()

      scrollLogContainer()
    },
  })

  const logContainerRef = useRef<HTMLDivElement>(null)

  if (isError) {
    return <div>Error</div>
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!scenarioLog) {
    return <div>Error - no data</div>
  }

  const handlePlayerInput = async (value: { action: string }) => {
    mutation.mutate({ action: value.action })
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
          scenarioLog={scenarioLog}
          logContainerRef={logContainerRef}
        />

        <ScenarioPlayerInput onSubmit={handlePlayerInput} />
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/scenarios/play')({
  component: ScenarioPlayPage,
})
