import {
  Command,
  Noun,
  ProcessAction,
  ScenarioState,
  Verb,
  VerbHandler,
} from '@shared/types/scenario'
import { scenarioUtils } from './scenarioUtils'
import { askHandler } from './verbHandlers/askHandler'
import { lookHandler } from './verbHandlers/lookHandler'
import { measureHandler } from './verbHandlers/measureHandler'
import { moveHandler } from './verbHandlers/moveHandler'
import { palpateHandler } from './verbHandlers/palpateHandler'
import { surveyHandler } from './verbHandlers/surveyHandler'

const verbHandlers: Record<Verb, VerbHandler> = {
  look: lookHandler,
  palpate: palpateHandler,
  measure: measureHandler,
  ask: askHandler,
  move: moveHandler,
  survey: surveyHandler,
}

const processAction = (input: ProcessAction, scenarioState: ScenarioState) => {
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
  return verbHandlers[verb] || lookHandler
}

const resolveObject = (objectName: Noun, scenarioState: ScenarioState) => {
  if (scenarioUtils.isBodyPartName(objectName)) {
    return scenarioState.patient.bodyParts.find(
      (part) => part.part === objectName,
    )
  }

  if (scenarioUtils.isQuestionTarget(objectName)) {
    return objectName
  }

  switch (objectName) {
    case 'patient':
      return scenarioState.patient
    case 'environment':
      return scenarioState.environment
    case 'pulse':
      return 'pulse'
    case 'respiratoryRate':
      return 'respiratoryRate'
    case 'in':
      return 'in'
    case 'hazards':
      return scenarioState.environment
    case 'mechanismOfInjury':
      return scenarioState.patient
    default:
      return undefined
  }
}

export const scenarioEngine = {
  processAction,
}
