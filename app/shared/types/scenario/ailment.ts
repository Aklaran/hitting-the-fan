import { z } from 'zod'
import { bodyPartSchema } from './bodyPart'
import { effortSchema, pupilSchema, rhythmSchema, skinSchema } from './vitals'

export const bleedSchema = z.enum(['major', 'minor', 'none'])
export type Bleed = z.infer<typeof bleedSchema>

export const effectsSchema = z.object({
  circulation: z.object({
    heartRateMultiplier: z.number().positive().max(100),
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
  bodyParts: z.array(bodyPartSchema),
})
export type Effects = z.infer<typeof effectsSchema>

export const ailmentSchema = z.object({
  name: z.string(),
  description: z.string(),

  mechanismOfInjury: z.string(),

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
  normality: z.string(),
  happenedBefore: z.string(),

  // TODO: make effects optional
  effects: effectsSchema,
})
export type Ailment = z.infer<typeof ailmentSchema>
