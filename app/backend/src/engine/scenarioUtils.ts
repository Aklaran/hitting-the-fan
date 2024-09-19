import { ScenarioLogEntry, ScenarioState } from '@shared/types/scenario'

const appendLogEntry = (
  scenarioState: ScenarioState,
  text: string,
  type: 'narrator' | 'player',
) => {
  const logEntry: ScenarioLogEntry = {
    text,
    type,
  }

  scenarioState.log = [...scenarioState.log, logEntry]
  return scenarioState
}

export const scenarioUtils = {
  appendLogEntry,
}
