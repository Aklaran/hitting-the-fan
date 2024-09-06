import { ScenarioLogOutput } from '@/components/custom-ui/scenarioLogOutput'
import { ScenarioPlayerInput } from '@/components/custom-ui/scenarioPlayerInput'
import { scenarioEngine } from '@shared/engine/scenarioEngine'
import { Scenario } from '@shared/types/scenario'
import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState } from 'react'

function PlayScenario() {
  const [scenario, setScenario] = useState<Scenario>({
    log: [
      {
        text: 'Your climbing partner just took a gnarly whip. You have lowered them to the bottom of the pitch and they are sitting there, clutching their ankle. They are still tied in to the rope, and you still have them on belay.',
        type: 'narrator',
      },
    ],
  })

  const handlePlayerInput = async (value: { action: string }) => {
    const newScenario = scenarioEngine.processAction(value.action, scenario)

    setScenario(newScenario)

    scrollLogContainer()
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
    })
  }

  const logContainerRef = useRef<HTMLDivElement>(null)

  return (
    <div className="pt-2">
      <div className="flex flex-col justify-between gap-2 border rounded p-2 w-5/6 h-96 max-h-dvh mx-auto">
        <ScenarioLogOutput
          scenario={scenario}
          logContainerRef={logContainerRef}
        />

        <ScenarioPlayerInput onSubmit={handlePlayerInput} />
      </div>
    </div>
  )
}

export const Route = createFileRoute('/scenario/play')({
  component: PlayScenario,
})
