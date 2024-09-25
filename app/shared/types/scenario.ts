import { z } from 'zod'

export const scenarioLogEntrySchema = z.object({
  text: z.string(),
  type: z.enum(['player', 'narrator']),
})

export const scenarioLogSchema = z.array(scenarioLogEntrySchema)

export const bodyPartNames = z.enum([
  'head',
  'neck',
  'chest',
  'stomach',
  'back',
  'leftArm',
  'rightArm',
  'leftHand',
  'rightHand',
  'leftLeg',
  'rightLeg',
  'leftFoot',
  'rightFoot',
])

export type BodyPartName = z.infer<typeof bodyPartNames>

export const bodyPartSchema = z.object({
  part: bodyPartNames,
  description: z.string(),
  palpationResponse: z.string(),
})

export const ailmentSchema = z.object({
  name: z.string(),
  description: z.string(),
  effects: z.object({
    heartRateMultiplier: z.number().positive().max(100),
    respiratoryRateMultiplier: z.number().positive().max(100),
    coreTemperatureCelsiusMultiplier: z.number().positive().max(100),
    bodyParts: z.array(bodyPartSchema),
  }),
})

export const patientSchema = z.object({
  name: z.string(),
  description: z.string(),
  age: z.number().int().nonnegative().max(100),
  gender: z.enum(['male', 'female', 'other']),
  heartRate: z.number().int().nonnegative().max(200),
  respiratoryRate: z.number().int().nonnegative().max(60),
  coreTemperatureCelsius: z.number().int().nonnegative().max(45),
  bodyParts: z.array(bodyPartSchema),
  ailments: z.array(ailmentSchema),
})

export const environmentSchema = z.object({
  description: z.string(),
  temperatureCelsius: z.number().int().min(-40).max(45),
})

export const scenarioStateSchema = z.object({
  log: scenarioLogSchema,
  patient: patientSchema,
  environment: environmentSchema,
})

export const processActionSchema = z.object({
  action: z.string(),
})

export const viewableSchema = z.object({
  description: z.string(),
})

export type Viewable = z.infer<typeof viewableSchema>

export const verbSchema = z.enum([
  'look',
  'help',
  'break',
  'ask',
  'palpate',
  'measure',
])

export const nounSchema = z.enum([
  'patient',
  'leg',
  'name',
  'environment',
  ...bodyPartNames.options,
  'pulse',
  'respiratoryRate',
])

export const questionTargetSchema = z.enum(['name', 'age', 'gender'])

export type QuestionTarget = z.infer<typeof questionTargetSchema>

export const commandSchema = z.object({
  verb: verbSchema,
  object: z
    .union([
      patientSchema,
      environmentSchema,
      ailmentSchema,
      bodyPartSchema,
      z.number(),
      z.string(),
    ])
    .optional(),
})

export const verbHandlerSchema = z.object({
  execute: z
    .function()
    .args(commandSchema, scenarioStateSchema)
    .returns(scenarioStateSchema),
})

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

type Scenario = z.infer<typeof scenarioSchema>
export type CreateScenarioSchema = z.infer<typeof createScenarioSchema>
export type GetScenarioSchema = z.infer<typeof getScenarioSchema>
export type DeleteScenarioSchema = z.infer<typeof deleteScenarioSchema>

export type ScenarioId = z.infer<typeof scenarioSchema.shape.id>

export type ScenarioLogEntry = z.infer<typeof scenarioLogEntrySchema>
export type ScenarioLog = z.infer<typeof scenarioLogSchema>
export type ScenarioState = z.infer<typeof scenarioStateSchema>
export type ProcessActionSchema = z.infer<typeof processActionSchema>
export type BodyPart = z.infer<typeof bodyPartSchema>
export type Ailment = z.infer<typeof ailmentSchema>
export type Patient = z.infer<typeof patientSchema>
export type Environment = z.infer<typeof environmentSchema>
export type Command = z.infer<typeof commandSchema>
export type Verb = z.infer<typeof verbSchema>
export type Noun = z.infer<typeof nounSchema>
export type VerbHandler = z.infer<typeof verbHandlerSchema>

export default Scenario
