import {
  ActionLog,
  ActionResponse,
  ActionResult,
  Command,
  CommandObject,
  CreateCommandResult,
  Modifier,
  modifierSchema,
  Noun,
  ProcessAction,
  ScenarioId,
  ScenarioState,
  Verb,
  VerbHandler,
} from '@shared/types/scenario'
import { UserId } from '@shared/types/user'
import logger from '@shared/util/logger'
import { applyHandler } from './handlers/verbHandlers/applyHandler'
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
  apply: applyHandler,
}

const withActionLog = (
  userId: UserId,
  sessionId: string,
  scenarioId: ScenarioId,
  action: (
    input: ProcessAction,
    actionLog: Partial<ActionLog>,
    scenarioState: ScenarioState,
  ) => ActionResponse,
) => {
  return (
    input: ProcessAction,
    actionLog: Partial<ActionLog>,
    scenarioState: ScenarioState,
  ) => {
    actionLog.timestamp = new Date()
    actionLog.userId = userId
    actionLog.sessionId = sessionId
    actionLog.scenarioId = scenarioId

    const response = action(input, actionLog, scenarioState)

    actionLog.rawInput = input.action
    actionLog.actionResult = response.result
    actionLog.narratorResponse = response.responseText
    actionLog.duration = new Date().getTime() - actionLog.timestamp!.getTime()

    logger.info(actionLog, 'Action Processed')

    return response
  }
}

const processAction = (
  userId: UserId,
  sessionId: string,
  scenarioId: ScenarioId,
  input: ProcessAction,
  scenarioState: ScenarioState,
): ActionResponse => {
  return withActionLog(
    userId,
    sessionId,
    scenarioId,
    processActionCore,
  )(input, {}, scenarioState)
}

const processActionCore = (
  input: ProcessAction,
  actionLog: Partial<ActionLog>,
  scenarioState: ScenarioState,
): ActionResponse => {
  const { action } = input

  const initialState = scenarioUtils.appendLogEntry(
    scenarioState,
    action,
    'player',
  )

  const createCommandResult = createCommand(action, initialState)

  if (createCommandResult.result === 'parse_failure') {
    return appendNarratorResponse(
      createCommandResult.response.scenarioState,
      createCommandResult.response.responseText,
      createCommandResult.response.result,
    )
  }

  const command = createCommandResult.command

  actionLog.verb = command.verb
  actionLog.objectType = serializeCommandObjectForLog(command.object)
  actionLog.modifiers = command.modifiers

  const verbHandler = getVerbHandler(command.verb)

  try {
    const executionResponse = verbHandler.execute(command, initialState)

    return appendNarratorResponse(
      executionResponse.scenarioState,
      executionResponse.responseText,
      executionResponse.result,
    )
  } catch (error) {
    const err = error as Error

    logger.error(
      `Error in ${command.verb} verb handler: ${err.message}, ${err.stack}`,
    )

    return appendNarratorResponse(
      initialState,
      "I'm sorry, but I encountered an error while processing your request.",
      'unexpected_error',
    )
  }
}

const serializeCommandObjectForLog = (obj?: CommandObject): string => {
  if (!obj) return 'undefined'

  if (typeof obj === 'string') return obj

  if ('partName' in obj) return `bodyPart:${obj.partName}`
  if ('name' in obj && 'age' in obj) return `patient:${obj.name}:${obj.age}`
  if ('description' in obj) return `environment:${obj.description}`

  return 'unknown'
}

const appendNarratorResponse = (
  scenarioState: ScenarioState,
  responseText: string,
  actionResult: ActionResult,
): ActionResponse => {
  const newState = scenarioUtils.appendLogEntry(
    scenarioState,
    responseText,
    'narrator',
  )
  return {
    responseText,
    scenarioState: newState,
    result: actionResult,
  }
}

const createCommand = (
  action: string,
  scenarioState: ScenarioState,
): CreateCommandResult => {
  const tokens = action.split(' ')

  if (tokens.length === 0) {
    return {
      result: 'parse_failure',
      response: {
        responseText: 'You did not provide an action.',
        scenarioState,
        result: 'parse_failure',
      },
    }
  }

  const verb = tokens[0].toLowerCase()

  if (!scenarioUtils.isVerb(verb)) {
    return {
      result: 'parse_failure',
      response: {
        responseText: `"${verb}" is not a valid verb.`,
        scenarioState,
        result: 'parse_failure',
      },
    }
  }

  const objectName = tokens[1]

  if (!scenarioUtils.isNoun(objectName)) {
    return {
      result: 'parse_failure',
      response: {
        responseText: `"${objectName}" is not a valid object.`,
        scenarioState,
        result: 'parse_failure',
      },
    }
  }

  const object = resolveObject(objectName, scenarioState)

  if (scenarioUtils.isActionResponse(object)) {
    return {
      result: 'parse_failure',
      response: object,
    }
  }

  // HACK: Only look for modifiers from the 2nd elem of tokens onward
  const modifiers = resolveModifiers(tokens.slice(2), scenarioState)

  if (scenarioUtils.isActionResponse(modifiers)) {
    return {
      result: 'parse_failure',
      response: modifiers,
    }
  }

  const command: Command = {
    verb,
    object,
    modifiers,
  }

  return {
    result: 'success',
    command,
  }
}

const getVerbHandler = (verb: Verb): VerbHandler => {
  return verbHandlers[verb] || lookHandler
}

const resolveObject = (
  objectName: Noun,
  scenarioState: ScenarioState,
): CommandObject | ActionResponse => {
  if (scenarioUtils.isBodyPartName(objectName)) {
    const bodyPart = scenarioState.patient.bodyParts.find(
      (part) => part.partName === objectName,
    )

    if (!bodyPart) {
      return {
        responseText: `The patient does not have a ${objectName}.`,
        scenarioState,
        result: 'parse_failure',
      }
    }

    return bodyPart
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

  if (scenarioUtils.isPerformTarget(objectName)) {
    return objectName
  }

  if (scenarioUtils.isApplyTarget(objectName)) {
    return objectName
  }

  if (objectName === 'environment' || objectName === 'hazards') {
    return scenarioState.environment
  }

  if (objectName === 'patient') {
    return scenarioState.patient
  }

  return {
    responseText: `"${objectName}" is not a valid object.`,
    scenarioState,
    result: 'parse_failure',
  }
}

const resolveModifiers = (
  tokens: string[],
  scenarioState: ScenarioState,
): Modifier[] | ActionResponse => {
  if (tokens.length === 0) {
    return []
  }

  const modifiers = tokens.filter(
    (token): token is Modifier => modifierSchema.safeParse(token).success,
  )

  if (modifiers.length === 0) {
    return {
      responseText: `"${tokens.join(' ')}" is not a valid modifier.`,
      scenarioState,
      result: 'parse_failure',
    }
  }

  return modifiers
}

export const scenarioEngine = {
  processAction,
}
