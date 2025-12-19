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
import { GradingResult } from '@shared/types/scenario/grade'
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
import { getNaturalLanguageParser } from './nlp/naturalLanguageParser'
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
  ) => Promise<ActionResponse>,
) => {
  return async (
    input: ProcessAction,
    actionLog: Partial<ActionLog>,
    scenarioState: ScenarioState,
  ): Promise<ActionResponse> => {
    actionLog.timestamp = new Date()
    actionLog.userId = userId
    actionLog.sessionId = sessionId
    actionLog.scenarioId = scenarioId

    const response = await action(input, actionLog, scenarioState)

    actionLog.rawInput = input.action
    actionLog.actionResult = response.result
    actionLog.narratorResponse = response.responseText
    actionLog.duration = new Date().getTime() - actionLog.timestamp!.getTime()

    logger.info(actionLog, 'Action Processed')

    return response
  }
}

const processAction = async (
  userId: UserId,
  sessionId: string,
  scenarioId: ScenarioId,
  input: ProcessAction,
  scenarioState: ScenarioState,
): Promise<ActionResponse> => {
  return withActionLog(
    userId,
    sessionId,
    scenarioId,
    processActionCore,
  )(input, {}, scenarioState)
}

/**
 * Pre-process user input with NLP to convert natural language to commands.
 * Falls back to original input if NLP confidence is low.
 */
const preprocessWithNlp = async (action: string): Promise<string> => {
  try {
    const parser = await getNaturalLanguageParser()
    const parseResult = await parser.parse(action)
    const commandString = parser.toCommandString(parseResult)

    if (commandString.wasNlpParsed) {
      logger.debug(
        {
          originalInput: action,
          parsedCommand: commandString.command,
          confidence: commandString.confidence,
        },
        'NLP parsed user input',
      )
      return commandString.command
    }

    // Low confidence - use original input
    return action
  } catch (error) {
    // NLP failed - fall back to original input
    logger.warn({ error, action }, 'NLP parsing failed, using original input')
    return action
  }
}

const processActionCore = async (
  input: ProcessAction,
  actionLog: Partial<ActionLog>,
  scenarioState: ScenarioState,
): Promise<ActionResponse> => {
  const { action } = input

  // Pre-process with NLP to convert natural language to commands
  const processedAction = await preprocessWithNlp(action)

  const initialState = scenarioUtils.appendLogEntry(
    scenarioState,
    action, // Log the original user input, not the processed command
    'player',
  )

  const createCommandResult = createCommand(processedAction, initialState)

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

/**
 * Compares two Command objects for equality.
 * Handles different object types (string, patient, bodyPart, etc.)
 */
const commandsMatch = (
  command1: Command,
  command2: Command,
): boolean => {
  // Compare verbs
  if (command1.verb !== command2.verb) {
    return false
  }

  // Compare objects
  if (!commandObjectsMatch(command1.object, command2.object)) {
    return false
  }

  // Compare modifiers (order-independent for matching)
  const modifiers1 = (command1.modifiers || []).sort().join(',')
  const modifiers2 = (command2.modifiers || []).sort().join(',')

  return modifiers1 === modifiers2
}

/**
 * Compares two CommandObject values for equality.
 * Handles different object types: string, patient, bodyPart, environment, etc.
 */
const commandObjectsMatch = (
  obj1?: CommandObject,
  obj2?: CommandObject,
): boolean => {
  // Both undefined
  if (!obj1 && !obj2) {
    return true
  }

  // One undefined, one not
  if (!obj1 || !obj2) {
    return false
  }

  // Both strings
  if (typeof obj1 === 'string' && typeof obj2 === 'string') {
    return obj1 === obj2
  }

  // Both objects - compare by type-specific properties
  if (typeof obj1 === 'object' && typeof obj2 === 'object') {
    // BodyPart comparison
    if ('partName' in obj1 && 'partName' in obj2) {
      return obj1.partName === obj2.partName
    }

    // Patient comparison
    if ('name' in obj1 && 'age' in obj1 && 'name' in obj2 && 'age' in obj2) {
      return obj1.name === obj2.name && obj1.age === obj2.age
    }

    // Environment comparison (by description)
    if ('description' in obj1 && 'description' in obj2) {
      return obj1.description === obj2.description
    }

    // For other object types, do deep equality check
    return JSON.stringify(obj1) === JSON.stringify(obj2)
  }

  return false
}

/**
 * Checks if player actions are in the same order as perfect actions.
 * Returns true if matched actions appear in the same sequence.
 */
const actionsInOrder = (
  playerCommands: Command[],
  perfectActions: Command[],
): boolean => {
  if (playerCommands.length === 0 || perfectActions.length === 0) {
    return false
  }

  // Find indices of matched actions in perfectActions
  const matchedIndices: number[] = []
  let perfectIndex = 0

  for (const playerCmd of playerCommands) {
    // Find the next matching perfect action
    while (perfectIndex < perfectActions.length) {
      if (commandsMatch(playerCmd, perfectActions[perfectIndex])) {
        matchedIndices.push(perfectIndex)
        perfectIndex++
        break
      }
      perfectIndex++
    }
  }

  // Check if matched indices are in ascending order
  if (matchedIndices.length === 0) {
    return false
  }

  for (let i = 1; i < matchedIndices.length; i++) {
    if (matchedIndices[i] <= matchedIndices[i - 1]) {
      return false
    }
  }

  // Check if all matched actions are consecutive in perfectActions
  return matchedIndices.length === perfectActions.length
}

/**
 * Grades player actions against perfect actions and bad actions.
 * Returns a GradingResult with score and descriptive information.
 */
const gradeActions = (
  scenarioState: ScenarioState,
  perfectActions: Command[],
  badActions?: Command[],
): GradingResult => {
  // Extract player actions from log
  const playerActionStrings = scenarioState.log
    .filter((entry) => entry.type === 'player')
    .map((entry) => entry.text)

  // Parse player actions into Commands
  const playerCommands: Command[] = []
  for (const actionString of playerActionStrings) {
    const createCommandResult = createCommand(actionString, scenarioState)
    if (createCommandResult.result === 'success') {
      playerCommands.push(createCommandResult.command)
    }
    // Ignore parse failures - they don't match anything anyway
  }

  // Count matched perfect actions
  let matchedActions = 0
  const usedPerfectIndices = new Set<number>()

  for (const playerCmd of playerCommands) {
    for (let i = 0; i < perfectActions.length; i++) {
      if (!usedPerfectIndices.has(i) && commandsMatch(playerCmd, perfectActions[i])) {
        matchedActions++
        usedPerfectIndices.add(i)
        break
      }
    }
  }

  // Count bad actions
  let badActionsCount = 0
  if (badActions && badActions.length > 0) {
    for (const playerCmd of playerCommands) {
      for (const badAction of badActions) {
        if (commandsMatch(playerCmd, badAction)) {
          badActionsCount++
          break
        }
      }
    }
  }

  // Check order
  const orderBonus = actionsInOrder(playerCommands, perfectActions) ? 5 : 0

  // Calculate base score
  const totalPerfectActions = perfectActions.length || 1 // Avoid division by zero
  const baseScore = (matchedActions / totalPerfectActions) * 100

  // Apply penalties and bonuses
  const penalty = badActionsCount * 10
  let finalScore = baseScore + orderBonus - penalty

  // Clamp score to minimum 0 (allow bonuses to exceed 100)
  finalScore = Math.max(0, finalScore)

  // Generate feedback
  const feedback: string[] = []
  if (matchedActions === totalPerfectActions) {
    feedback.push('Perfect! You performed all the required actions.')
  } else if (matchedActions > 0) {
    feedback.push(
      `You performed ${matchedActions} out of ${totalPerfectActions} required actions.`,
    )
  } else {
    feedback.push('No required actions were performed.')
  }

  if (orderBonus > 0) {
    feedback.push('Great job following the correct sequence!')
  }

  if (badActionsCount > 0) {
    feedback.push(
      `Warning: ${badActionsCount} potentially harmful action${badActionsCount > 1 ? 's were' : ' was'} detected.`,
    )
  }

  return {
    score: Math.round(finalScore * 100) / 100, // Round to 2 decimal places
    matchedActions,
    totalPerfectActions: perfectActions.length,
    badActionsCount,
    orderBonus,
    feedback,
  }
}

export const scenarioEngine = {
  processAction,
  gradeActions,
}
