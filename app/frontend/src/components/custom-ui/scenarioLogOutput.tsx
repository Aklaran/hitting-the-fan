import { ScenarioState } from '@shared/types/scenario'

export function ScenarioLogOutput({
  scenarioState,
  logContainerRef,
}: {
  scenarioState: ScenarioState
  logContainerRef: React.RefObject<HTMLDivElement>
}) {
  return (
    <div ref={logContainerRef} className="overflow-y-auto overflow-x-hidden">
      {scenarioState.log.map((log, index) => (
        <div key={index} className="flex gap-1 mb-2">
          {log.type === 'player' && <p>&gt;</p>}
          <p>{log.text}</p>
        </div>
      ))}
    </div>
  )
}
