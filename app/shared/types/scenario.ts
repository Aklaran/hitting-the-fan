import { z } from 'zod'

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
})

export const createScenarioSchema = scenarioSchema.omit({ id: true })
export const getScenarioSchema = scenarioSchema.pick({ id: true })
export const deleteScenarioSchema = scenarioSchema.pick({ id: true })

type Scenario = z.infer<typeof scenarioSchema>
export type CreateScenarioSchema = z.infer<typeof createScenarioSchema>
export type GetScenarioSchema = z.infer<typeof getScenarioSchema>
export type DeleteScenarioSchema = z.infer<typeof deleteScenarioSchema>

export type ScenarioId = z.infer<typeof scenarioSchema.shape.id>

export const scenarioLogEntrySchema = z.object({
  text: z.string(),
  type: z.enum(['player', 'narrator']),
})

export const scenarioLogSchema = z.array(scenarioLogEntrySchema)

export const patientSchema = z.object({
  name: z.string(),
  age: z.number().int().positive().min(0).max(100),
  gender: z.enum(['male', 'female', 'other']),
  health: z.number().int().positive().min(0).max(100),
  heartRate: z.number().int().positive().min(0).max(200),
  respiratoryRate: z.number().int().positive().min(0).max(60),
  coreTemperatureCelsius: z.number().int().positive().min(0).max(45),
})

export const environmentSchema = z.object({
  temperature: z.number().int().positive().min(0).max(45),
})

export const scenarioStateSchema = z.object({
  log: scenarioLogSchema,
  patient: patientSchema,
  environment: environmentSchema,
})

export const processActionSchema = z.object({
  action: z.string(),
})

export type ScenarioLogEntry = z.infer<typeof scenarioLogEntrySchema>
export type ScenarioLog = z.infer<typeof scenarioLogSchema>
export type ScenarioState = z.infer<typeof scenarioStateSchema>
export type ProcessActionSchema = z.infer<typeof processActionSchema>

export default Scenario
