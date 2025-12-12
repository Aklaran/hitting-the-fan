import { z } from 'zod'
import { commandSchema } from './command'
import { scenarioStateSchema } from './state'

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
  perfectActions: z.array(commandSchema).default([]),
  badActions: z.array(commandSchema).optional(),
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

export default Scenario
