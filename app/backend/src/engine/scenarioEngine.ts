import {
  Command,
  Noun,
  ProcessActionSchema,
  ScenarioLogEntry,
  ScenarioState,
  Verb,
  VerbHandler,
} from '@shared/types/scenario'
import { lookHandler } from './verbHandlers/lookHandler'
import { palpateHandler } from './verbHandlers/palpateHandler'

const processAction = (
  input: ProcessActionSchema,
  scenarioState: ScenarioState,
) => {
  const { action } = input
  const { log } = scenarioState

  const actionState: ScenarioState = {
    ...scenarioState,
  }

  const actionLog: ScenarioLogEntry = {
    text: action,
    type: 'player',
  }

  actionState.log = [...log, actionLog]

  const command = createCommand(action, actionState)

  const verbHandler = getVerbHandler(command.verb)

  const finalState = verbHandler.execute(command, actionState)

  return finalState
}

const createCommand = (
  action: string,
  scenarioState: ScenarioState,
): Command => {
  const tokens = action.split(' ')

  const objectName = tokens[1] as Noun
  const object = resolveObject(objectName, scenarioState)

  const command: Command = {
    verb: tokens[0].toLowerCase() as Verb,
    object,
  }

  return command
}

const getVerbHandler = (verb: Verb): VerbHandler => {
  switch (verb) {
    case 'look':
      return lookHandler
    case 'palpate':
      return palpateHandler
    default:
      return lookHandler
  }
}

const resolveObject = (objectName: Noun, scenarioState: ScenarioState) => {
  switch (objectName) {
    case 'patient':
      return scenarioState.patient
    case 'environment':
      return scenarioState.environment
    case 'leftLeg':
      return scenarioState.patient.bodyParts.find(
        (part) => part.part === 'leftLeg',
      )
    case 'rightLeg':
      return scenarioState.patient.bodyParts.find(
        (part) => part.part === 'rightLeg',
      )
    default:
      return undefined
  }
}

export const scenarioEngine = {
  processAction,
}
