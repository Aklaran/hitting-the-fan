import {
  Command,
  CommandObject,
  Modifier,
  modifierSchema,
  Noun,
  ProcessAction,
  ScenarioState,
  Verb,
  VerbHandler,
} from '@shared/types/scenario'
import logger from '@shared/util/logger'
import { askHandler } from './handlers/verbHandlers/askHandler'
import { controlHandler } from './handlers/verbHandlers/controlHandler'
import { instructHandler } from './handlers/verbHandlers/instructHandler'
import { lookHandler } from './handlers/verbHandlers/lookHandler'
import { measureHandler } from './handlers/verbHandlers/measureHandler'
import { moveHandler } from './handlers/verbHandlers/moveHandler'
import { palpateHandler } from './handlers/verbHandlers/palpateHandler'
import { performHandler } from './handlers/verbHandlers/performHandler'
import { removeHandler } from './handlers/verbHandlers/removeHandler'
import { surveyHandler } from './handlers/verbHandlers/surveyHandler'
import { wearHandler } from './handlers/verbHandlers/wearHandler'
import { scenarioUtils } from './scenarioUtils'

const verbHandlers: Record<Verb, VerbHandler> = {
  look: lookHandler,
  palpate: palpateHandler,
  measure: measureHandler,
  ask: askHandler,
  instruct: instructHandler,
  move: moveHandler,
  survey: surveyHandler,
  wear: wearHandler,
  control: controlHandler,
  remove: removeHandler,
  perform: performHandler,
}

const processAction = (
  input: ProcessAction,
  scenarioState: ScenarioState,
): ScenarioState => {
  const { action } = input

  const initialState = scenarioUtils.appendLogEntry(
    scenarioState,
    action,
    'player',
  )

  const command = createCommand(action, initialState)

  const verbHandler = getVerbHandler(command.verb)

  try {
    const executionResponse = verbHandler.execute(command, initialState)

    const finalState = scenarioUtils.appendLogEntry(
      executionResponse.scenarioState,
      executionResponse.responseText,
      'narrator',
    )

    return finalState
  } catch (error) {
    const err = error as Error

    logger.error(
      `Error in ${command.verb} verb handler: ${err.message}, ${err.stack}`,
    )

    const finalState = scenarioUtils.appendLogEntry(
      initialState,
      "I'm sorry, but I encountered an error while processing your request.",
      'narrator',
    )

    return finalState
  }
}

const createCommand = (
  action: string,
  scenarioState: ScenarioState,
): Command => {
  const tokens = action.split(' ')

  const objectName = tokens[1] as Noun
  const object = resolveObject(objectName, scenarioState)

  // HACK: Only look for modifiers from the 2nd elem of tokens onward
  const modifiers = resolveModifiers(tokens.slice(2))

  // TODO: Gracefully handle the case of an unknown verb
  const command: Command = {
    verb: tokens[0].toLowerCase() as Verb,
    object,
    modifiers,
  }

  return command
}

const getVerbHandler = (verb: Verb): VerbHandler => {
  return verbHandlers[verb] || lookHandler
}

const resolveObject = (
  objectName: Noun,
  scenarioState: ScenarioState,
): CommandObject | undefined => {
  if (scenarioUtils.isBodyPartName(objectName)) {
    return scenarioState.patient.bodyParts.find(
      (part) => part.partName === objectName,
    )
  }

  if (scenarioUtils.isQuestionTarget(objectName)) {
    return objectName
  }

  if (scenarioUtils.isMeasureTarget(objectName)) {
    return objectName
  }

  if (scenarioUtils.isInventoryItem(objectName)) {
    return objectName
  }

  if (scenarioUtils.isMoveTarget(objectName)) {
    return objectName
  }

  if (scenarioUtils.isInstructTarget(objectName)) {
    return objectName
  }

  if (objectName === 'environment' || objectName === 'hazards') {
    return scenarioState.environment
  }

  if (objectName === 'patient' || objectName === 'mechanismOfInjury') {
    return scenarioState.patient
  }

  // If we can't resolve the object, return undefined
  return undefined
}

const resolveModifiers = (tokens: string[]): Modifier[] => {
  // TODO: notify the player if they passed in invalid modifiers
  return tokens.filter(
    (token): token is Modifier => modifierSchema.safeParse(token).success,
  )
}

export const scenarioEngine = {
  processAction,
}
