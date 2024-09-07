import {
  ProcessActionSchema,
  ScenarioLogEntry,
  ScenarioState,
} from '@shared/types/scenario'

const processAction = (
  input: ProcessActionSchema,
  scenarioState: ScenarioState,
) => {
  const { action } = input
  const { log } = scenarioState

  let responseText: string
  switch (action.toLowerCase()) {
    case 'look':
      responseText =
        'You see your injured climbing partner and the rocky cliff face.'
      break
    case 'help partner':
      responseText =
        "You carefully examine your partner's ankle. It appears to be sprained."
      break
    // Add more cases for different actions
    default:
      responseText = "You're not sure how to do that."
  }

  const actionLog: ScenarioLogEntry = {
    text: action,
    type: 'player',
  }

  const responseLog: ScenarioLogEntry = {
    text: responseText,
    type: 'narrator',
  }

  return { log: [...log, actionLog, responseLog] }
}

export const scenarioEngine = {
  processAction,
}
