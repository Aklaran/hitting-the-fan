import { z } from 'zod'
import { environmentSchema } from './environment'
import { scenarioLogSchema } from './log'
import { patientSchema } from './patient'
import { playerSchema } from './player'

export const scenarioStateSchema = z.object({
  log: scenarioLogSchema,
  player: playerSchema,
  patient: patientSchema,
  environment: environmentSchema,
})
export type ScenarioState = z.infer<typeof scenarioStateSchema>
