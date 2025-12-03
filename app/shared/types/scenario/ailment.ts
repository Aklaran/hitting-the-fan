import { z } from 'zod'
import { bodyPartSchema } from './bodyPart'
import { effortSchema, pupilSchema, rhythmSchema, skinSchema } from './vitals'

export const bleedSchema = z.enum(['major', 'minor', 'none'])
export type Bleed = z.infer<typeof bleedSchema>

const rateModifierTypeSchema = z.enum(['multiplicative', 'additive'])
export type RateModifierType = z.infer<typeof rateModifierTypeSchema>

const baseEffectsSchema = z.object({
  circulation: z.object({
    heartRateModifier: z.number().min(-100).max(100),
    rateModifierType: rateModifierTypeSchema,
    rhythm: rhythmSchema,
  }),
  respiration: z.object({
    respiratoryRateModifier: z.number().min(-100).max(100),
    rateModifierType: rateModifierTypeSchema,
    rhythm: rhythmSchema,
    effort: effortSchema,
  }),
  skin: skinSchema,
  pupils: pupilSchema,
  temperature: z.object({
    temperatureModifier: z.number().min(-100).max(100),
    rateModifierType: rateModifierTypeSchema,
  }),
  bleed: bleedSchema,
})

export const localEffectsSchema = baseEffectsSchema.extend({
  bodyParts: z.array(bodyPartSchema).min(1),
})
export type LocalEffects = z.infer<typeof localEffectsSchema>

export const globalEffectsSchema = baseEffectsSchema
export type GlobalEffects = z.infer<typeof globalEffectsSchema>

export const ailmentEffectsSchema = localEffectsSchema
export type AilmentEffects = z.infer<typeof ailmentEffectsSchema>

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

  effects: ailmentEffectsSchema,
})
export type Ailment = z.infer<typeof ailmentSchema>
