import { z } from 'zod'

export const scenarioLogEntrySchema = z.object({
  text: z.string(),
  type: z.enum(['player', 'narrator']),
})
export type ScenarioLogEntry = z.infer<typeof scenarioLogEntrySchema>

export const scenarioLogSchema = z.array(scenarioLogEntrySchema)
export type ScenarioLog = z.infer<typeof scenarioLogSchema>

