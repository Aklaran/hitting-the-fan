import {
  ailmentSchema,
  applyTargetSchema,
  bodyPartSchema,
  controlTargetSchema,
  measureTargetSchema,
  medicalTagSchema,
  patientSchema,
  performTargetSchema,
  questionTargetSchema,
  wearableSchema,
} from '@shared/types/scenario'
import { z } from 'zod'

export const pipelineContextSchema = z.object({})
export type PipelineContext = z.infer<typeof pipelineContextSchema>

export const wearableContextSchema = z.object({
  wearable: wearableSchema,
})
export type WearableContext = z.infer<typeof wearableContextSchema>

export const controllableContextSchema = z.object({
  controllable: controlTargetSchema,
})
export type ControllableContext = z.infer<typeof controllableContextSchema>

export const askableContextSchema = z.object({
  askable: questionTargetSchema,
})
export type AskableContext = z.infer<typeof askableContextSchema>

export const applicableContextSchema = z.object({
  applicable: applyTargetSchema,
})
export type ApplicableContext = z.infer<typeof applicableContextSchema>

export const medicalTagsContextSchema = z.object({
  medicalTags: medicalTagSchema,
})
export type MedicalTagsContext = z.infer<typeof medicalTagsContextSchema>

export const bodyPartContextSchema = z.object({
  bodyPart: bodyPartSchema,
})
export type BodyPartContext = z.infer<typeof bodyPartContextSchema>

export const bodyPartEffectsContextSchema = z.object({
  partEffects: bodyPartSchema.array(),
})
export type BodyPartEffectsContext = z.infer<
  typeof bodyPartEffectsContextSchema
>

export const injuryContextSchema = z.object({
  injuries: bodyPartSchema.array(),
})
export type InjuryContext = z.infer<typeof injuryContextSchema>

export const ailmentContextSchema = z.object({
  ailment: ailmentSchema,
})
export type AilmentContext = z.infer<typeof ailmentContextSchema>

export const ailmentsContextSchema = z.object({
  ailments: ailmentSchema.array(),
})
export type AilmentsContext = z.infer<typeof ailmentsContextSchema>

export const performableContextSchema = z.object({
  performable: performTargetSchema,
})
export type PerformableContext = z.infer<typeof performableContextSchema>

export const measureableContextSchema = z.object({
  measureable: measureTargetSchema,
})
export type MeasureableContext = z.infer<typeof measureableContextSchema>

export const realizedPatientContextSchema = z.object({
  realizedPatient: patientSchema,
})
export type RealizedPatientContext = z.infer<
  typeof realizedPatientContextSchema
>
