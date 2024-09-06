import { z } from 'zod'

export const scenarioLogEntrySchema = z.object({
  text: z.string(),
  type: z.enum(['player', 'narrator']),
})

export const scenarioLogSchema = z.array(scenarioLogEntrySchema)

export const scenarioSchema = z.object({
  log: scenarioLogSchema,
})

export type ScenarioLogEntry = z.infer<typeof scenarioLogEntrySchema>
export type ScenarioLog = z.infer<typeof scenarioLogSchema>
export type Scenario = z.infer<typeof scenarioSchema>
