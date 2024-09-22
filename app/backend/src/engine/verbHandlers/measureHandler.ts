import { Command, ScenarioState, VerbHandler } from '@shared/types/scenario'
import { scenarioUtils } from '../scenarioUtils'

export const measureHandler: VerbHandler = {
  execute: (command: Command, scenarioState: ScenarioState): ScenarioState => {
    let responseText = 'What do you want to measure? (NO OBJECT)'

    if (command.object === 'pulse') {
      responseText = measurePulse(scenarioState)
    }

    scenarioUtils.appendLogEntry(scenarioState, responseText, 'narrator')
    return scenarioState
  },
}

const measurePulse = (scenarioState: ScenarioState) => {
  const pulse = scenarioState.patient.heartRate
  return `You measure the pulse at ${pulse} beats per minute.`
}
