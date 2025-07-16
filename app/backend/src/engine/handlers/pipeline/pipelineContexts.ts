import {
  ailmentSchema,
  bodyPartSchema,
  controlTargetSchema,
  medicalTagSchema,
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

export const medicalTagsContextSchema = z.object({
  medicalTags: medicalTagSchema,
})
export type MedicalTagsContext = z.infer<typeof medicalTagsContextSchema>

export const bodyPartContextSchema = z.object({
  bodyPart: bodyPartSchema,
})
export type BodyPartContext = z.infer<typeof bodyPartContextSchema>

export const injuryContextSchema = z.object({
  injuries: bodyPartSchema.array(),
})
export type InjuryContext = z.infer<typeof injuryContextSchema>

export const ailmentContextSchema = z.object({
  ailment: ailmentSchema,
})
export type AilmentContext = z.infer<typeof ailmentContextSchema>
