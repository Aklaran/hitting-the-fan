import {
  Command,
  Noun,
  ProcessActionSchema,
  ScenarioState,
  Verb,
  VerbHandler,
} from '@shared/types/scenario'
import { scenarioUtils } from './scenarioUtils'
import { lookHandler } from './verbHandlers/lookHandler'
import { palpateHandler } from './verbHandlers/palpateHandler'

const processAction = (
  input: ProcessActionSchema,
  scenarioState: ScenarioState,
) => {
  const { action } = input

  scenarioUtils.appendLogEntry(scenarioState, action, 'player')

  const command = createCommand(action, scenarioState)

  const verbHandler = getVerbHandler(command.verb)

  const finalState = verbHandler.execute(command, scenarioState)

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
