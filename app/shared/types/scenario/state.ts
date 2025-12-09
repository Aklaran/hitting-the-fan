import { z } from 'zod'
import { treatmentKeySchema, treatmentSchema } from './ailment'
import { environmentSchema } from './environment'
import { gradeSchema } from './grade'
import { scenarioLogSchema } from './log'
import { patientSchema } from './patient'
import { playerSchema } from './player'

export const scenarioStateSchema = z.object({
  log: scenarioLogSchema,
  player: playerSchema,
  patient: patientSchema,
  environment: environmentSchema,
  possibleGlobalTreatments: z.array(treatmentSchema),
  globalTreatmentsApplied: z.array(treatmentKeySchema),
  grade: gradeSchema.nullable(),
})
export type ScenarioState = z.infer<typeof scenarioStateSchema>
