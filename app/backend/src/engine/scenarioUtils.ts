import {
  Ailment,
  BodyPart,
  BodyPartName,
  bodyPartNames,
  bodyPartSchema,
  ControlTarget,
  controlTargetSchema,
  InstructTarget,
  instructTargetSchema,
  InventoryItem,
  LevelOfResponsiveness,
  LOR_VALUES,
  PerformTarget,
  performTargetSchema,
  QuestionTarget,
  questionTargetSchema,
  RemoveTarget,
  removeTargetSchema,
  ScenarioLogEntry,
  ScenarioState,
  scenarioStateSchema,
  Viewable,
  viewableSchema,
  Wearable,
  wearableSchema,
} from '@shared/types/scenario'
import logger from '@shared/util/logger'
import { z, ZodTypeAny } from 'zod'

const appendLogEntry = (
  scenarioState: ScenarioState,
  text: string,
  type: 'narrator' | 'player',
) => {
  const logEntry: ScenarioLogEntry = {
    text,
    type,
  }

  const newLog = [...scenarioState.log, logEntry]
  return { ...scenarioState, log: newLog }
}

const isSchema = <T extends ZodTypeAny>(
  schema: T,
  obj: unknown,
): obj is z.infer<T> => {
  const result = schema.safeParse(obj)

  if (!result.success) {
    logger.debug(`isSchema returning false because: ${result.error.message}`)
    return false
  }

  return result.success
}

const isScenarioState = (obj: unknown): obj is ScenarioState => {
  return isSchema(scenarioStateSchema, obj)
}

const isBodyPart = (obj: unknown): obj is BodyPart => {
  return isSchema(bodyPartSchema, obj)
}

const isBodyPartName = (str: string): str is BodyPartName => {
  return isSchema(bodyPartNames, str)
}

const isViewable = (obj: unknown): obj is Viewable => {
  return isSchema(viewableSchema, obj)
}

const isQuestionTarget = (obj: unknown): obj is QuestionTarget => {
  return isSchema(questionTargetSchema, obj)
}

const isInstructTarget = (obj: unknown): obj is InstructTarget => {
  return isSchema(instructTargetSchema, obj)
}

const isControlTarget = (obj: unknown): obj is ControlTarget => {
  return isSchema(controlTargetSchema, obj)
}

const isPerformTarget = (obj: unknown): obj is PerformTarget => {
  return isSchema(performTargetSchema, obj)
}

const isRemoveTarget = (obj: unknown): obj is RemoveTarget => {
  return isSchema(removeTargetSchema, obj)
}

const isWearable = (obj: unknown): obj is Wearable => {
  return isSchema(wearableSchema, obj)
}

const getBodyPartByName = (
  bodyParts: BodyPart[],
  name: BodyPartName,
): BodyPart | undefined => {
  return bodyParts.find((part) => part.part === name)
}

const getAilmentsByBodyPart = (ailments: Ailment[], bodyPart: BodyPart) => {
  return ailments
    .flatMap((ailment) => ailment.effects.bodyParts)
    .filter((part) => part.part === bodyPart.part)
}

const removeFromInventory = (
  itemToRemove: InventoryItem,
  scenarioState: ScenarioState,
): ScenarioState => {
  let removed = false
  const newInventory = scenarioState.player.inventory.filter((item) => {
    if (!removed && item === itemToRemove) {
      removed = true
      return false
    }

    return true
  })

  return {
    ...scenarioState,
    player: { ...scenarioState.player, inventory: newInventory },
  }
}

export const scenarioUtils = {
  appendLogEntry,
  isScenarioState,
  isBodyPart,
  isBodyPartName,
  isViewable,
  isWearable,
  isSchema,
  isQuestionTarget,
  isInstructTarget,
  isControlTarget,
  isPerformTarget,
  isRemoveTarget,
  getBodyPartByName,
  getAilmentsByBodyPart,
  removeFromInventory,
}

// Level of Responsiveness

export const LORCapabilities = {
  isUnresponsive: (lor: LevelOfResponsiveness) =>
    LOR_VALUES[lor] == LOR_VALUES.U,

  respondsToPain: (lor: LevelOfResponsiveness) =>
    LOR_VALUES[lor] >= LOR_VALUES.P,

  respondsToSound: (lor: LevelOfResponsiveness) =>
    LOR_VALUES[lor] >= LOR_VALUES.V,

  isAwake: (lor: LevelOfResponsiveness) => LOR_VALUES[lor] >= LOR_VALUES.AO0,

  knowsIdentity: (lor: LevelOfResponsiveness) =>
    LOR_VALUES[lor] >= LOR_VALUES.AO1,

  knowsLocation: (lor: LevelOfResponsiveness) =>
    LOR_VALUES[lor] >= LOR_VALUES.AO2,

  knowsTime: (lor: LevelOfResponsiveness) => LOR_VALUES[lor] >= LOR_VALUES.AO3,

  knowsEvents: (lor: LevelOfResponsiveness) =>
    LOR_VALUES[lor] >= LOR_VALUES.AO4,

  isHigherThan: (lor: LevelOfResponsiveness, than: LevelOfResponsiveness) =>
    LOR_VALUES[lor] > LOR_VALUES[than],
} as const
