import {
  ActionLog,
  ActionResponse,
  Command,
  CommandObject,
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
    (
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

      const command = createCommand(action, initialState)

      if (scenarioUtils.isActionResponse(command)) {
        const finalState = scenarioUtils.appendLogEntry(
          command.scenarioState,
          command.responseText,
          'narrator',
        )

        return {
          responseText: command.responseText,
          scenarioState: finalState,
          result: command.result,
        }
      }

      actionLog.command = command

      const verbHandler = getVerbHandler(command.verb)

      try {
        const executionResponse = verbHandler.execute(command, initialState)

        const finalState = scenarioUtils.appendLogEntry(
          executionResponse.scenarioState,
          executionResponse.responseText,
          'narrator',
        )

        return {
          responseText: executionResponse.responseText,
          scenarioState: finalState,
          result: executionResponse.result,
        }
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

        return {
          responseText:
            "I'm sorry, but I encountered an error while processing your request.",
          scenarioState: finalState,
          result: 'unexpected_error',
        }
      }
    },
  )(input, {}, scenarioState)
}

const createCommand = (
  action: string,
  scenarioState: ScenarioState,
): Command | ActionResponse => {
  const tokens = action.split(' ')

  if (tokens.length === 0) {
    return {
      responseText: 'You did not provide an action.',
      scenarioState,
      result: 'parse_failure',
    }
  }

  const verb = tokens[0].toLowerCase()

  if (!scenarioUtils.isVerb(verb)) {
    return {
      responseText: `"${verb}" is not a valid verb.`,
      scenarioState,
      result: 'parse_failure',
    }
  }

  const objectName = tokens[1]

  if (!scenarioUtils.isNoun(objectName)) {
    return {
      responseText: `"${objectName}" is not a valid object.`,
      scenarioState,
      result: 'parse_failure',
    }
  }

  const object = resolveObject(objectName, scenarioState)

  if (scenarioUtils.isActionResponse(object)) {
    return object
  }

  // HACK: Only look for modifiers from the 2nd elem of tokens onward
  const modifiers = resolveModifiers(tokens.slice(2), scenarioState)

  if (scenarioUtils.isActionResponse(modifiers)) {
    return modifiers
  }

  const command: Command = {
    verb,
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

  if (objectName === 'environment' || objectName === 'hazards') {
    return scenarioState.environment
  }

  if (objectName === 'patient' || objectName === 'mechanismOfInjury') {
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
