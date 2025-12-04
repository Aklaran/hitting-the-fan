import {
  ActionResponse,
  actionResponseSchema,
  Ailment,
  ApplyTarget,
  applyTargetSchema,
  BodyPart,
  BodyPartName,
  bodyPartNames,
  bodyPartSchema,
  circulationCapablePartNameSchema,
  CirculationOnlyPartName,
  Command,
  ControlTarget,
  controlTargetSchema,
  CSM,
  CSMCapablePartName,
  csmCapablePartNames,
  Distance,
  EFFORT_PRIORITIES,
  InstructTarget,
  instructTargetSchema,
  InventoryItem,
  inventoryItemSchema,
  LevelOfResponsiveness,
  LocalEffects,
  LOR_VALUES,
  MeasureTarget,
  measureTargetSchema,
  MoveTarget,
  moveTargetSchema,
  Noun,
  nounSchema,
  OBSTRUCTION_PRIORITIES,
  Patient,
  PerformTarget,
  performTargetSchema,
  Position,
  positionSchema,
  PUPIL_EQUALITY_PRIORITIES,
  PUPIL_REACTIVITY_PRIORITIES,
  PUPIL_SHAPE_PRIORITIES,
  QuestionTarget,
  questionTargetSchema,
  RemoveTarget,
  removeTargetSchema,
  RHYTHM_PRIORITIES,
  ScenarioLogEntry,
  ScenarioState,
  scenarioStateSchema,
  Treatment,
  Verb,
  verbSchema,
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

const isCirculationCapablePartName = (
  str: string,
): str is CirculationOnlyPartName => {
  return isSchema(circulationCapablePartNameSchema, str)
}

const isExtremityName = (str: string): str is CSMCapablePartName => {
  return isSchema(csmCapablePartNames, str)
}

const isViewable = (obj: unknown): obj is Viewable => {
  return isSchema(viewableSchema, obj)
}

const isQuestionTarget = (obj: unknown): obj is QuestionTarget => {
  return isSchema(questionTargetSchema, obj)
}

const isApplyTarget = (obj: unknown): obj is ApplyTarget => {
  return isSchema(applyTargetSchema, obj)
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

const isMeasureTarget = (obj: unknown): obj is MeasureTarget => {
  return isSchema(measureTargetSchema, obj)
}

const isActionResponse = (obj: unknown): obj is ActionResponse => {
  return isSchema(actionResponseSchema, obj)
}

const isWearable = (obj: unknown): obj is Wearable => {
  return isSchema(wearableSchema, obj)
}

const isPosition = (obj: unknown): obj is Position => {
  return isSchema(positionSchema, obj)
}

const isInventoryItem = (obj: unknown): obj is InventoryItem => {
  return isSchema(inventoryItemSchema, obj)
}

const isMoveTarget = (obj: unknown): obj is MoveTarget => {
  return isSchema(moveTargetSchema, obj)
}

const isVerb = (str: string): str is Verb => {
  return isSchema(verbSchema, str)
}

const isNoun = (str: string): str is Noun => {
  return isSchema(nounSchema, str)
}

const hasLocalEffects = (
  treatment: Treatment,
): treatment is Treatment & { effects: LocalEffects } => {
  return 'bodyParts' in treatment.effects
}

const getBodyPartByName = (
  bodyParts: BodyPart[],
  name: BodyPartName,
): BodyPart | undefined => {
  return bodyParts.find((part) => part.partName === name)
}

/**
 * Gets all ailment effects that affect a specific body part
 * @param ailments List of ailments to search through
 * @param bodyPart The body part to find ailments for
 * @returns Array of ailments that are affecting the body part
 */
const getAilmentsByBodyPart = <T extends BodyPart>(
  ailments: Ailment[],
  bodyPart: T,
): Ailment[] => {
  return ailments.filter((ailment) => {
    return ailment.effects.bodyParts.some(
      (part): part is T => part.partName === bodyPart.partName,
    )
  })
}

/**
 * Gets all ailment effects that affect a specific body part
 * @param ailments List of ailments to search through
 * @param bodyPart The body part to find effects for
 * @returns Array of body part effects from ailments that match the given body part
 */
const getAilmentEffectsByBodyPart = <T extends BodyPart>(
  ailments: Ailment[],
  bodyPart: T,
): T[] => {
  return ailments.flatMap((ailment) => {
    const ailmentEffectsOnPart = ailment.effects.bodyParts.filter(
      (part): part is T => part.partName === bodyPart.partName,
    )

    if (!ailmentEffectsOnPart || ailmentEffectsOnPart.length == 0) return []

    const treatmentEffectsAppliedToAilment = ailment.possibleTreatments
      .filter((possibleTreatment) =>
        ailment.appliedTreatments.some(
          (treatmentKey) => possibleTreatment.key === treatmentKey,
        ),
      )
      .filter(hasLocalEffects)

    if (
      !treatmentEffectsAppliedToAilment ||
      treatmentEffectsAppliedToAilment.length == 0
    ) {
      return ailmentEffectsOnPart
    }

    const treatmentEffectsOnPart = treatmentEffectsAppliedToAilment
      .flatMap((treatment) => treatment.effects.bodyParts)
      .filter((part) => part.partName === bodyPart.partName)

    const treatmentDescriptions = treatmentEffectsOnPart
      .map((part) => part.description.obstructed)
      .join(' ')

    const treatmentObstructedState = treatmentEffectsOnPart
      .map((part) => part.obstructedState)
      .reduce((prev, curr) =>
        OBSTRUCTION_PRIORITIES[prev] < OBSTRUCTION_PRIORITIES[curr]
          ? prev
          : curr,
      )

    return ailmentEffectsOnPart.map((part) => ({
      ...part,
      description: {
        obstructed: treatmentDescriptions,
      },
      obstructedState: treatmentObstructedState,
    }))
  })
}

/**
 * Gets a body part and all ailment effects that affect it
 * @param ailments List of ailments to search through
 * @param bodyPart The body part to get effects for
 * @returns Array containing the original body part and any matching effects from ailments
 */
const getEffectsOnBodyPart = <T extends BodyPart>(
  ailments: Ailment[],
  bodyPart: T,
): T[] => {
  const ailmentEffects = ailments
    .flatMap((ailment) => ailment.effects.bodyParts)
    .filter((part): part is T => {
      return part.partName === bodyPart.partName
    })

  return [bodyPart, ...ailmentEffects]
}

const getMostProminentBodyPartValue = <T extends BodyPart, K extends CSM>(
  affectedParts: T[],
  getValue: (part: T) => K,
  priorities: Record<K, number>,
) => {
  return affectedParts.map(getValue).reduce((prev, curr) => {
    return priorities[curr] < priorities[prev] ? curr : prev
  })
}

const getMostProminentValue = <T extends string>(
  competingValues: T[],
  priorities: Record<T, number>,
) => {
  return competingValues.reduce((prev, curr) => {
    return priorities[curr] < priorities[prev] ? curr : prev
  })
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

const calculateHeartRate = (patient: Patient) => {
  const baseRate = patient.circulation.rate

  const multiplier = patient.ailments
    .map((ailment) => ailment.effects.circulation.heartRateModifier)
    .reduce((prev, curr) => prev * curr)

  return Math.round(baseRate * multiplier)
}

const calculateHeartRhythm = (patient: Patient) => {
  const baseRhythm = patient.circulation.rhythm

  const ailmentRhythms = patient.ailments.map(
    (ailment) => ailment.effects.circulation.rhythm,
  )

  return getMostProminentValue(
    [baseRhythm, ...ailmentRhythms],
    RHYTHM_PRIORITIES,
  )
}

const calculateRespiratoryRate = (patient: Patient) => {
  const baseRate = patient.respiration.rate

  const multiplier = patient.ailments
    .map((ailment) => ailment.effects.respiration.respiratoryRateModifier)
    .reduce((prev, curr) => prev * curr)

  return Math.round(baseRate * multiplier)
}

const calculateRespiratoryRhythm = (patient: Patient) => {
  const baseRhythm = patient.respiration.rhythm

  const ailmentRhythms = patient.ailments.map(
    (ailment) => ailment.effects.respiration.rhythm,
  )

  return getMostProminentValue(
    [baseRhythm, ...ailmentRhythms],
    RHYTHM_PRIORITIES,
  )
}

const calculateRespiratoryEffort = (patient: Patient) => {
  const baseEffort = patient.respiration.effort

  const ailmentEfforts = patient.ailments.map(
    (ailment) => ailment.effects.respiration.effort,
  )

  return getMostProminentValue(
    [baseEffort, ...ailmentEfforts],
    EFFORT_PRIORITIES,
  )
}

const calculatePupilEquality = (patient: Patient) => {
  const baseEquality = patient.pupils.equality

  const ailmentEqualities = patient.ailments.map(
    (ailment) => ailment.effects.pupils.equality,
  )

  return getMostProminentValue(
    [baseEquality, ...ailmentEqualities],
    PUPIL_EQUALITY_PRIORITIES,
  )
}

const calculatePupilReactivity = (patient: Patient) => {
  const baseReactivity = patient.pupils.reactivity

  const ailmentReactivities = patient.ailments.map(
    (ailment) => ailment.effects.pupils.reactivity,
  )

  return getMostProminentValue(
    [baseReactivity, ...ailmentReactivities],
    PUPIL_REACTIVITY_PRIORITIES,
  )
}

const calculatePupilShape = (patient: Patient) => {
  const baseShape = patient.pupils.shape

  const ailmentShapes = patient.ailments.map(
    (ailment) => ailment.effects.pupils.shape,
  )

  return getMostProminentValue(
    [baseShape, ...ailmentShapes],
    PUPIL_SHAPE_PRIORITIES,
  )
}

const calculateTemperature = (patient: Patient) => {
  const baseTemperature = patient.temperatureFahrenheit

  const multiplier = patient.ailments
    .map((ailment) => ailment.effects.temperature.temperatureModifier)
    .reduce((prev, curr) => prev * curr)

  return Math.round(baseTemperature * multiplier)
}

const withDistanceCheck = (
  expectedDistance: Distance,
  handler: (command: Command, scenarioState: ScenarioState) => ActionResponse,
) => {
  return (command: Command, scenarioState: ScenarioState): ActionResponse => {
    if (
      expectedDistance === 'near' &&
      scenarioState.player.distanceToPatient === 'far'
    ) {
      const responseText = 'You are too far away to do that.'
      return { responseText, scenarioState, result: 'guard_failure' }
    }

    if (
      expectedDistance === 'far' &&
      scenarioState.player.distanceToPatient === 'near'
    ) {
      const responseText = 'You are too close to do that.'
      return { responseText, scenarioState, result: 'guard_failure' }
    }

    return handler(command, scenarioState)
  }
}

const withConsciousnessCheck = (
  handler: (command: Command, scenarioState: ScenarioState) => ActionResponse,
) => {
  return (command: Command, scenarioState: ScenarioState): ActionResponse => {
    const levelOfResponsiveness = scenarioState.patient.levelOfResponsiveness

    if (!LORCapabilities.isAwake(levelOfResponsiveness)) {
      return {
        responseText: 'The patient is knocked tf out.',
        scenarioState,
        result: 'guard_failure',
      }
    }

    return handler(command, scenarioState)
  }
}

const withInventoryCheck = (
  handler: (scenarioState: ScenarioState) => string,
) => {
  return (item: InventoryItem, scenarioState: ScenarioState): string => {
    if (!scenarioState.player.inventory.includes(item)) {
      return `You need a(n) ${item} to do that.`
    }

    return handler(scenarioState)
  }
}

export const scenarioUtils = {
  appendLogEntry,
  isScenarioState,
  isBodyPart,
  isBodyPartName,
  isCirculationCapablePartName,
  isExtremityName,
  isViewable,
  isWearable,
  isSchema,
  isQuestionTarget,
  isApplyTarget,
  isInstructTarget,
  isControlTarget,
  isPerformTarget,
  isRemoveTarget,
  isMeasureTarget,
  isActionResponse,
  isPosition,
  isInventoryItem,
  isMoveTarget,
  isVerb,
  isNoun,
  getBodyPartByName,
  getAilmentsByBodyPart,
  getAilmentEffectsByBodyPart,
  getEffectsOnBodyPart,
  getMostProminentBodyPartValue,
  getMostProminentValue,
  calculateHeartRate,
  calculateHeartRhythm,
  calculateRespiratoryRate,
  calculateRespiratoryRhythm,
  calculateRespiratoryEffort,
  calculatePupilEquality,
  calculatePupilReactivity,
  calculatePupilShape,
  calculateTemperature,
  removeFromInventory,
  withDistanceCheck,
  withConsciousnessCheck,
  withInventoryCheck,
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
