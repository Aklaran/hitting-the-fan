import { z } from 'zod'

// SCENARIO LOG //

export const scenarioLogEntrySchema = z.object({
  text: z.string(),
  type: z.enum(['player', 'narrator']),
})
export type ScenarioLogEntry = z.infer<typeof scenarioLogEntrySchema>

export const scenarioLogSchema = z.array(scenarioLogEntrySchema)
export type ScenarioLog = z.infer<typeof scenarioLogSchema>

// -- ENVIRONMENT -- //

export const environmentSchema = z.object({
  description: z.string(),
  temperatureCelsius: z.number().int().min(-40).max(45),
  hazards: z.array(z.string()),
})
export type Environment = z.infer<typeof environmentSchema>

export const distanceSchema = z.enum(['near', 'far'])
export type Distance = z.infer<typeof distanceSchema>

// -- PATIENT -- //

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
  effects: z.object({
    heartRateMultiplier: z.number().positive().max(100),
    respiratoryRateMultiplier: z.number().positive().max(100),
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

export const RHYTHM_PRIORITIES: Record<Rhythm, number> = {
  irregular: 0,
  regular: 1,
}

export const rhythmSchema = z.enum(['regular', 'irregular'])
export type Rhythm = z.infer<typeof rhythmSchema>

export const effortSchema = z.enum(['easy', 'labored'])
export type Effort = z.infer<typeof effortSchema>

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

export const patientSchema = z.object({
  name: z.string(),
  descriptions: z.object({
    [distanceSchema.Enum.near]: z.string(),
    [distanceSchema.Enum.far]: z.string(),
  }),
  age: z.number().int().nonnegative().max(100),
  gender: z.enum(['male', 'female', 'other']),
  circulation: z.object({
    rate: z.number().int().nonnegative().max(200),
    rhythm: rhythmSchema,
  }),
  respiration: z.object({
    rate: z.number().int().nonnegative().max(60),
    rhythm: rhythmSchema,
    effort: effortSchema,
  }),
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
})
export type Patient = z.infer<typeof patientSchema>

// -- PLAYER -- //

export const wearableSchema = z.enum(['gloves', 'mask'])
export type Wearable = z.infer<typeof wearableSchema>

export const inventoryItemSchema = z.enum([...wearableSchema.options])
export type InventoryItem = z.infer<typeof inventoryItemSchema>

export const playerSchema = z.object({
  distanceToPatient: distanceSchema,
  inventory: z.array(inventoryItemSchema),
  worn: z.array(wearableSchema),
  // TODO: Track whether the player is occupied (controlling spine, CPR)
})
export type Player = z.infer<typeof playerSchema>

// -- SCENARIO STATE -- //

export const scenarioStateSchema = z.object({
  log: scenarioLogSchema,
  player: playerSchema,
  patient: patientSchema,
  environment: environmentSchema,
})
export type ScenarioState = z.infer<typeof scenarioStateSchema>

// -- COMMAND -- //

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

export const performTargetSchema = z.enum(['bloodSweep'])
export type PerformTarget = z.infer<typeof performTargetSchema>

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

export const commandSchema = z.object({
  verb: verbSchema,
  object: z
    .union([
      patientSchema,
      environmentSchema,
      ailmentSchema,
      bodyPartSchema,
      // TODO: Replace these generic options with specific ones
      z.number(),
      z.string(),
    ])
    .optional(),
  modifiers: z.array(modifierSchema).optional(),
})
export type Command = z.infer<typeof commandSchema>

export const verbResponseSchema = z.object({
  responseText: z.string(),
  scenarioState: scenarioStateSchema,
})
export type VerbResponse = z.infer<typeof verbResponseSchema>

export const verbHandlerSchema = z.object({
  execute: z
    .function()
    .args(commandSchema, scenarioStateSchema)
    .returns(verbResponseSchema),
})
export type VerbHandler = z.infer<typeof verbHandlerSchema>

// -- SCENARIO -- //

export const scenarioSchema = z.object({
  id: z.number().int().positive().min(1),
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

export type Scenario = z.infer<typeof scenarioSchema>
export type CreateScenarioSchema = z.infer<typeof createScenarioSchema>
export type GetScenarioSchema = z.infer<typeof getScenarioSchema>
export type DeleteScenarioSchema = z.infer<typeof deleteScenarioSchema>

export type ScenarioId = z.infer<typeof scenarioSchema.shape.id>

export default Scenario
