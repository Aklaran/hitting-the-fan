import {
  Command,
  Modifier,
  modifierSchema,
  Noun,
  ProcessAction,
  questionTargetSchema,
  ScenarioState,
  Verb,
  VerbHandler,
  wearableSchema,
} from '@shared/types/scenario'
import logger from '@shared/util/logger'
import { scenarioUtils } from './scenarioUtils'
import { askHandler } from './verbHandlers/askHandler'
import { controlHandler } from './verbHandlers/controlHandler'
import { instructHandler } from './verbHandlers/instructHandler'
import { lookHandler } from './verbHandlers/lookHandler'
import { measureHandler } from './verbHandlers/measureHandler'
import { moveHandler } from './verbHandlers/moveHandler'
import { palpateHandler } from './verbHandlers/palpateHandler'
import { performHandler } from './verbHandlers/performHandler'
import { removeHandler } from './verbHandlers/removeHandler'
import { surveyHandler } from './verbHandlers/surveyHandler'
import { wearHandler } from './verbHandlers/wearHandler'

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

// TODO: I don't think this is actually doing anything for me,
//       Let's revisit object resolution sometime.
const resolveObject = (objectName: Noun, scenarioState: ScenarioState) => {
  if (scenarioUtils.isBodyPartName(objectName)) {
    return scenarioState.patient.bodyParts.find(
      (part) => part.partName === objectName,
    )
  }

  if (scenarioUtils.isQuestionTarget(objectName)) {
    return questionTargetSchema.Enum[objectName]
  }

  if (scenarioUtils.isWearable(objectName)) {
    return wearableSchema.Enum[objectName]
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
      return objectName
  }
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
