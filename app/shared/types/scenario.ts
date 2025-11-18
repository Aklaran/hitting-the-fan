import { z } from 'zod'

//#region Scenario Log

export const scenarioLogEntrySchema = z.object({
  text: z.string(),
  type: z.enum(['player', 'narrator']),
})
export type ScenarioLogEntry = z.infer<typeof scenarioLogEntrySchema>

export const scenarioLogSchema = z.array(scenarioLogEntrySchema)
export type ScenarioLog = z.infer<typeof scenarioLogSchema>

//#endregion

//#region Environment

export const environmentSchema = z.object({
  description: z.string(),
  temperatureCelsius: z.number().int().min(-40).max(45),
  hazards: z.array(z.string()),
  time: z.string(),
  place: z.string(),
})
export type Environment = z.infer<typeof environmentSchema>

export const distanceSchema = z.enum(['near', 'far'])
export type Distance = z.infer<typeof distanceSchema>

//#endregion

//#region Patient

// BODY PART //

export const csmCapablePartNames = z.enum([
  'leftHand',
  'rightHand',
  'leftFoot',
  'rightFoot',
])
export type CSMCapablePartName = z.infer<typeof csmCapablePartNames>

export const circulationOnlyPartNames = z.enum(['neck'])
export type CirculationOnlyPartName = z.infer<typeof circulationOnlyPartNames>

export const basicPartNames = z.enum([
  'head',
  'mouth',
  'chest',
  'stomach',
  // TODO: 'back' and 'spine' are synonyms for each other. We should make a synonym system.
  'back',
  'spine',
  'hips',
  'leftArm',
  'rightArm',
  'leftLeg',
  'rightLeg',
])
export type BasicPartName = z.infer<typeof basicPartNames>

export const bodyPartNames = z.union([
  circulationOnlyPartNames,
  csmCapablePartNames,
  basicPartNames,
])
export type BodyPartName = z.infer<typeof bodyPartNames>

export const obstructionSchema = z.enum(['obstructed', 'unobstructed'])
export type Obstruction = z.infer<typeof obstructionSchema>

export const baseBodyPartSchema = z.object({
  partName: basicPartNames,
  description: z.object({
    [obstructionSchema.Enum.obstructed]: z.string(),
    [obstructionSchema.Enum.unobstructed]: z.string(),
  }),
  palpationResponse: z.string(),
  obstructedState: obstructionSchema,
})
export type BaseBodyPart = z.infer<typeof baseBodyPartSchema>

// Lower value == higher priority
// This is to allow for more values to be added without changing the map.
export const PULSE_QUALITY_PRIORITIES = {
  absent: 0,
  weak: 1,
  bounding: 2,
  strong: 3,
} as const

export const pulseQualitySchema = z.enum([
  'absent',
  'weak',
  'bounding',
  'strong',
])
export type PulseQuality = z.infer<typeof pulseQualitySchema>

// Specifically used for circulation at CSM-capable body parts..
// since pulse quality changes by location but rate and rhythm do not.
export const circulationSchema = z.object({
  quality: pulseQualitySchema,
})
export type Circulation = z.infer<typeof circulationSchema>

export const circulationOnlyBodyPartSchema = baseBodyPartSchema.extend({
  partName: circulationOnlyPartNames,
  circulation: circulationSchema,
})
export type CirculationOnlyBodyPart = z.infer<
  typeof circulationOnlyBodyPartSchema
>

export const RHYTHM_PRIORITIES: Record<Rhythm, number> = {
  irregular: 0,
  regular: 1,
}

export const rhythmSchema = z.enum(['regular', 'irregular'])
export type Rhythm = z.infer<typeof rhythmSchema>

export const EFFORT_PRIORITIES: Record<Effort, number> = {
  labored: 0,
  easy: 1,
}

export const effortSchema = z.enum(['easy', 'labored'])
export type Effort = z.infer<typeof effortSchema>

// TODO: How to do priorities for skin values?

export const skinTemperatureSchema = z.enum(['warm', 'cool', 'hot'])
export type SkinTemperature = z.infer<typeof skinTemperatureSchema>

export const skinColorSchema = z.enum(['pink', 'pale', 'red', 'ashen'])
export type SkinColor = z.infer<typeof skinColorSchema>

export const skinMoistureSchema = z.enum(['dry', 'moist', 'clammy', 'wet'])
export type SkinMoisture = z.infer<typeof skinMoistureSchema>

export const skinSchema = z.object({
  temperature: skinTemperatureSchema,
  color: skinColorSchema,
  moisture: skinMoistureSchema,
})
export type Skin = z.infer<typeof skinSchema>

export const pupilShapeSchema = z.enum(['round', 'not... round?'])
export type PupilShape = z.infer<typeof pupilShapeSchema>

export const PUPIL_SHAPE_PRIORITIES: Record<PupilShape, number> = {
  'not... round?': 0,
  round: 1,
}

export const pupilEqualitySchema = z.enum(['equal', 'unequal'])
export type pupilEquality = z.infer<typeof pupilEqualitySchema>

export const PUPIL_EQUALITY_PRIORITIES: Record<pupilEquality, number> = {
  unequal: 0,
  equal: 1,
}

export const pupilReactivitySchema = z.enum([
  'reactive',
  'late reactive',
  'unreactive',
])
export type PupilReactivity = z.infer<typeof pupilReactivitySchema>

export const PUPIL_REACTIVITY_PRIORITIES: Record<PupilReactivity, number> = {
  unreactive: 0,
  'late reactive': 1,
  reactive: 2,
}

export const pupilSchema = z.object({
  shape: pupilShapeSchema,
  equality: pupilEqualitySchema,
  reactivity: pupilReactivitySchema,
})

export type Pupil = z.infer<typeof pupilSchema>

// Lower value == higher priority
// This is to allow for more values to be added without changing the map.
export const SENSATION_PRIORITIES: Record<Sensation, number> = {
  absent: 0,
  numb: 1,
  tingling: 2,
  cold: 3,
  hot: 4,
  normal: 5,
}

export const sensationSchema = z.enum([
  'absent',
  'numb',
  'tingling',
  'cold',
  'hot',
  'normal',
])
export type Sensation = z.infer<typeof sensationSchema>

export const MOTION_PRIORITIES: Record<Motion, number> = {
  immobile: 0,
  tremor: 1,
  normal: 2,
}

// TODO: Get a better set of options for this
export const motionSchema = z.enum(['normal', 'tremor', 'immobile'])
export type Motion = z.infer<typeof motionSchema>

export const csmSchema = z.union([
  motionSchema,
  sensationSchema,
  pulseQualitySchema,
])
export type CSM = z.infer<typeof csmSchema>

export const csmCapableBodyPartSchema = baseBodyPartSchema.extend({
  partName: csmCapablePartNames,
  circulation: circulationSchema,
  sensation: sensationSchema,
  motion: motionSchema,
})
export type CSMCapableBodyPart = z.infer<typeof csmCapableBodyPartSchema>

export const circulationCapablePartNameSchema = z.enum([
  ...circulationOnlyPartNames.options,
  ...csmCapablePartNames.options,
])
export type CirculationCapablePartName = z.infer<
  typeof circulationCapablePartNameSchema
>

export const circulationCapableBodyPartSchema = z.discriminatedUnion(
  'partName',
  [circulationOnlyBodyPartSchema, csmCapableBodyPartSchema],
)
export type CirculationCapableBodyPart = z.infer<
  typeof circulationCapableBodyPartSchema
>

export const bodyPartSchema = z.discriminatedUnion('partName', [
  csmCapableBodyPartSchema,
  circulationOnlyBodyPartSchema,
  baseBodyPartSchema,
])
export type BodyPart = z.infer<typeof bodyPartSchema>

// AILMENT //

export const bleedSchema = z.enum(['major', 'minor', 'none'])
export type Bleed = z.infer<typeof bleedSchema>

export const ailmentSchema = z.object({
  name: z.string(),
  description: z.string(),

  isChiefComplaint: z.boolean(),
  provokers: z.string(),
  palliatives: z.string(),
  quality: z.string(),
  region: z.string(),
  radiation: z.string(),
  referral: z.string(),
  severity: z.string(),
  onsetTime: z.string(),
  intensityTrend: z.string(),

  // TODO: make effects optional
  effects: z.object({
    circulation: z.object({
      heartRateMultiplier: z.number().positive().max(100), // TODO: revisit if multipler, average, or max is the best way to go.
      rhythm: rhythmSchema,
    }),
    respiration: z.object({
      respiratoryRateMultiplier: z.number().positive().max(100),
      rhythm: rhythmSchema,
      effort: effortSchema,
    }),
    skin: skinSchema,
    pupils: pupilSchema,
    coreTemperatureCelsiusMultiplier: z.number().positive().max(100),
    bleed: bleedSchema,
    bodyParts: z.array(
      z.union([
        baseBodyPartSchema.omit({ obstructedState: true }),
        csmCapableBodyPartSchema.omit({ obstructedState: true }),
        circulationOnlyBodyPartSchema.omit({ obstructedState: true }),
      ]),
    ),
  }),
})
export type Ailment = z.infer<typeof ailmentSchema>

// PATIENT //

export const medicalTagSchema = z.object({
  description: z.string(),
})
export type MedicalTag = z.infer<typeof medicalTagSchema>

export const LOR_VALUES: Record<LevelOfResponsiveness, number> = {
  U: 0,
  P: 1,
  V: 2,
  AO0: 3,
  AO1: 4,
  AO2: 5,
  AO3: 6,
  AO4: 7,
} as const

export const levelOfResponsivenessSchema = z.enum([
  'U', // unresponsive
  'P', // not awake. responds only to painful stimulus
  'V', // not awake. responds only to verbal stimulus
  'AO0', // awake, but not oriented.
  'AO1', // awake and oriented to Person
  'AO2', // awake and oriented to Person, Place
  'AO3', // awake and oriented to Person, Place, Time
  'AO4', // awake and oriented to Person, Place, Time, and Events
])
export type LevelOfResponsiveness = z.infer<typeof levelOfResponsivenessSchema>

export const positionSchema = z.enum([
  'standing',
  'seated',
  'supine',
  'prone',
  'rightLateralRecumbent',
  'leftLateralRecumbent',
])
export type Position = z.infer<typeof positionSchema>

export const medicationSchema = z.enum(['zyrtec', 'advil', 'aspirin'])
export type Medication = z.infer<typeof medicationSchema>

export const allergySchema = z.enum([
  ...medicationSchema.options,
  'dogs',
  'cats',
])
export type Allergy = z.infer<typeof allergySchema>

export const patientSchema = z.object({
  name: z.string(),
  descriptions: z.object({
    [distanceSchema.Enum.near]: z.string(),
    [distanceSchema.Enum.far]: z.string(),
  }),
  age: z.number().int().nonnegative().max(100),
  gender: z.enum(['male', 'female', 'other']),
  temperatureFahrenheit: z.number().nonnegative().max(116),
  circulation: z.object({
    rate: z.number().int().nonnegative().max(200),
    rhythm: rhythmSchema,
  }),
  respiration: z.object({
    rate: z.number().int().nonnegative().max(60),
    rhythm: rhythmSchema,
    effort: effortSchema,
  }),
  skin: skinSchema,
  pupils: pupilSchema,
  levelOfResponsiveness: levelOfResponsivenessSchema,
  coreTemperatureCelsius: z.number().int().nonnegative().max(45),
  bodyParts: z.array(bodyPartSchema),
  ailments: z.array(ailmentSchema),
  mechanismOfInjury: z.string(),
  instructions: z.object({
    dontMove: z.boolean(),
    acceptCare: z.boolean(),
    breathe: z.boolean(),
  }),
  isSpineControlled: z.boolean(),
  medicalTag: medicalTagSchema.optional(),
  events: z.string(),
  position: positionSchema,
  allergies: allergySchema.array(),
  medications: medicationSchema.array(),
  lastIntakeOutput: z.string(),
  hasDiabetes: z.boolean(),
  hasAsthma: z.boolean(),
  hasSeizures: z.boolean(),
  hasHeartConditions: z.boolean(),
})
export type Patient = z.infer<typeof patientSchema>

//#endregion

//#region Player

export const wearableSchema = z.enum(['gloves', 'mask'])
export type Wearable = z.infer<typeof wearableSchema>

export const inventoryItemSchema = z.enum([
  ...wearableSchema.options,
  'thermometer',
])
export type InventoryItem = z.infer<typeof inventoryItemSchema>

export const playerSchema = z.object({
  distanceToPatient: distanceSchema,
  inventory: z.array(inventoryItemSchema),
  worn: z.array(wearableSchema),
  // TODO: Track whether the player is occupied (controlling spine, CPR)
})
export type Player = z.infer<typeof playerSchema>

//#endregion

//#region Scenario State

export const scenarioStateSchema = z.object({
  log: scenarioLogSchema,
  player: playerSchema,
  patient: patientSchema,
  environment: environmentSchema,
})
export type ScenarioState = z.infer<typeof scenarioStateSchema>

//#endregion

//#region Command

export const processActionSchema = z.object({
  action: z.string(),
})
export type ProcessAction = z.infer<typeof processActionSchema>

export const viewableSchema = z.object({
  description: z.string(),
})
export type Viewable = z.infer<typeof viewableSchema>

export const verbSchema = z.enum([
  'look',
  'ask',
  'instruct',
  'palpate',
  'measure',
  'move',
  'survey',
  'wear',
  'control',
  'remove',
  'perform',
])
export type Verb = z.infer<typeof verbSchema>

export const directionSchema = z.enum(['in'])
export type Direction = z.infer<typeof directionSchema>

export const nounSchema = z.enum([
  'patient',
  'leg',
  'name',
  'environment',
  // HACK: Is there a better way to nested unwrap these zod enums?
  ...bodyPartNames.options[0].options,
  ...bodyPartNames.options[1].options,
  'pulse',
  'respiratoryRate',
  'in',
  'hazards',
  'mechanismOfInjury',
  ...inventoryItemSchema.options,
])
export type Noun = z.infer<typeof nounSchema>

export const questionTargetSchema = z.enum([
  'name',
  'age',
  'gender',
  'injury',
  'medicalTags',
  'whatHappened',
  'time',
  'place',
  'allergies',
  'medications',
  'lastIntakeOutput',
  'diabetes',
  'asthma',
  'seizures',
  'heartConditions',
  'chiefComplaint',
  'onset',
  'provokers',
  'palliatives',
  'quality',
  'region',
  'radiation',
  'referral',
  'severity',
  'intensityTrend',
])
export type QuestionTarget = z.infer<typeof questionTargetSchema>

export const instructTargetSchema = z.enum([
  'dontMove',
  'acceptCare',
  'breathe',
])
export type InstructTarget = z.infer<typeof instructTargetSchema>

export const controlTargetSchema = baseBodyPartSchema.refine(
  (bodyPart) => bodyPart.partName === 'spine' || bodyPart.partName === 'head',
  {
    message: "Body part must be 'spine' or 'head'",
  },
)
export type ControlTarget = z.infer<typeof controlTargetSchema>

export const performTargetSchema = z.enum([
  'bloodSweep',
  'focusedSpineAssessment',
])
export type PerformTarget = z.infer<typeof performTargetSchema>

export const measureTargetSchema = z.enum([
  'respiration',
  'pulse',
  'pupils',
  'sensation',
  'motion',
  'skinTemperature',
  'skinColor',
  'skinMoisture',
  'temperature',
])
export type MeasureTarget = z.infer<typeof measureTargetSchema>

export const modifierSchema = z.enum([
  'remove',
  'loose',
  'tight',
  'obstruction',
  // HACK: Is there a better way to unwrap these nested zod enums?
  ...bodyPartNames.options[0].options,
  ...bodyPartNames.options[1].options,
  ...bodyPartNames.options[2].options,
  ...positionSchema.options,
])
export type Modifier = z.infer<typeof modifierSchema>

export const removeTargetSchema = z.enum([modifierSchema.Enum.obstruction])
export type RemoveTarget = z.infer<typeof removeTargetSchema>

export const moveTargetSchema = z.union([directionSchema, patientSchema])
export type MoveTarget = z.infer<typeof moveTargetSchema>

// Define the command object schema separately for better type inference
export const commandObjectSchema = z.union([
  patientSchema,
  environmentSchema,
  ailmentSchema,
  bodyPartSchema,
  questionTargetSchema,
  instructTargetSchema,
  controlTargetSchema,
  performTargetSchema,
  removeTargetSchema,
  moveTargetSchema,
  measureTargetSchema,
  inventoryItemSchema,
])
export type CommandObject = z.infer<typeof commandObjectSchema>

export const commandSchema = z.object({
  verb: verbSchema,
  object: commandObjectSchema.optional(),
  modifiers: z.array(modifierSchema).optional(),
})
export type Command = z.infer<typeof commandSchema>

export const actionResultSchema = z.enum([
  'success',
  'parse_failure',
  'guard_failure',
  'unexpected_error',
])
export type ActionResult = z.infer<typeof actionResultSchema>

export const actionResponseSchema = z.object({
  responseText: z.string(),
  scenarioState: scenarioStateSchema,
  result: actionResultSchema.default('success'),
})
export type ActionResponse = z.infer<typeof actionResponseSchema>

export const verbHandlerSchema = z.object({
  execute: z
    .function()
    .args(commandSchema, scenarioStateSchema)
    .returns(actionResponseSchema),
})
export type VerbHandler = z.infer<typeof verbHandlerSchema>
//#endregion

//#region Logging
export const actionLogSchema = z.object({
  timestamp: z.date(),
  userId: z.number().int().positive().min(1),
  sessionId: z.string(),
  scenarioId: z.number().int().positive().min(1),

  rawInput: z.string(),
  command: commandSchema,
  actionResult: actionResultSchema,
  narratorResponse: z.string(),

  duration: z.number().int().positive(),
})
export type ActionLog = z.infer<typeof actionLogSchema>
//#endregion

//#region Scenario

export const scenarioSchema = z.object({
  id: z.number().int().positive().min(1),
  key: z.string({ required_error: 'Key is required.' }).min(3, {
    message: 'Key must be at least 3 characters long.',
  }),
  title: z.string({ required_error: 'Title is required.' }).min(3, {
    message: 'Title must be at least 3 characters long.',
  }),
  openingPrompt: z
    .string({ required_error: 'Opening prompt is required.' })
    .min(10, {
      message: 'Opening prompt must be at least 10 characters long.',
    }),
  initialState: scenarioStateSchema.required(),
})

export const createScenarioSchema = scenarioSchema.omit({ id: true })
export const getScenarioSchema = scenarioSchema.pick({ id: true })
export const deleteScenarioSchema = scenarioSchema.pick({ id: true })
export const getScenariosSchema = scenarioSchema.omit({
  initialState: true,
})

export type Scenario = z.infer<typeof scenarioSchema>
export type CreateScenarioSchema = z.infer<typeof createScenarioSchema>
export type GetScenarioSchema = z.infer<typeof getScenarioSchema>
export type DeleteScenarioSchema = z.infer<typeof deleteScenarioSchema>
export type GetScenariosSchema = z.infer<typeof getScenariosSchema>

export type ScenarioId = z.infer<typeof scenarioSchema.shape.id>

//#endregion

export default Scenario
