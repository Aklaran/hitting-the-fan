import { Scenario } from '@shared/types/scenario'

export function ScenarioLogOutput({
  scenario,
  logContainerRef,
}: {
  scenario: Scenario
  logContainerRef: React.RefObject<HTMLDivElement>
}) {
  return (
    <div ref={logContainerRef} className="overflow-y-auto overflow-x-hidden">
      {scenario.log.map((log, index) => (
        <div key={index} className="flex gap-1 mb-2">
          {log.type === 'player' && <p>&gt;</p>}
          <p>{log.text}</p>
        </div>
      ))}
    </div>
  )
}
