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
  const { log, patient } = scenarioState

  const newState: ScenarioState = {
    ...scenarioState,
  }

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
    case 'break leg':
      newState.patient.health = patient.health - 20
      responseText = `Jesus Christ, why would you do that? You break your patient's leg. Their health is now ${newState.patient.health}.`
      break
    case 'ask name':
      responseText = `The patient looks at you and says "My name ${patient.name}!"`
      break
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

  newState.log = [...log, actionLog, responseLog]

  return newState
}

export const scenarioEngine = {
  processAction,
}
