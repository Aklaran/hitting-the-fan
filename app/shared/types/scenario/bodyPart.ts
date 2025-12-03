import { z } from 'zod'
import {
  circulationSchema,
  motionSchema,
  obstructionSchema,
  sensationSchema,
} from './vitals'

export const csmCapablePartNames = z.enum([
  'leftHand',
  'rightHand',
  'leftFoot',
  'rightFoot',
])
export type CSMCapablePartName = z.infer<typeof csmCapablePartNames>

export const circulationOnlyPartNames = z.enum(['neck'])
export type CirculationOnlyPartName = z.infer<typeof circulationOnlyPartNames>

export const basicPartNames = z.enum([
  'head',
  'mouth',
  'chest',
  'stomach',
  // TODO: 'back' and 'spine' are synonyms for each other. We should make a synonym system.
  'back',
  'spine',
  'hips',
  'leftArm',
  'rightArm',
  'leftLeg',
  'rightLeg',
])
export type BasicPartName = z.infer<typeof basicPartNames>

export const bodyPartNames = z.union([
  circulationOnlyPartNames,
  csmCapablePartNames,
  basicPartNames,
])
export type BodyPartName = z.infer<typeof bodyPartNames>

export const baseBodyPartSchema = z.object({
  partName: basicPartNames,
  motion: motionSchema,
  description: z.object({
    [obstructionSchema.Enum.obstructed]: z.string(),
    [obstructionSchema.Enum.unobstructed]: z.string(),
  }),
  palpationResponse: z.string(),
  obstructedState: obstructionSchema,
})
export type BaseBodyPart = z.infer<typeof baseBodyPartSchema>

export const circulationOnlyBodyPartSchema = baseBodyPartSchema.extend({
  partName: circulationOnlyPartNames,
  circulation: circulationSchema,
})
export type CirculationOnlyBodyPart = z.infer<
  typeof circulationOnlyBodyPartSchema
>

export const csmCapableBodyPartSchema = baseBodyPartSchema.extend({
  partName: csmCapablePartNames,
  circulation: circulationSchema,
  sensation: sensationSchema,
  motion: motionSchema,
})
export type CSMCapableBodyPart = z.infer<typeof csmCapableBodyPartSchema>

export const circulationCapablePartNameSchema = z.enum([
  ...circulationOnlyPartNames.options,
  ...csmCapablePartNames.options,
])
export type CirculationCapablePartName = z.infer<
  typeof circulationCapablePartNameSchema
>

export const circulationCapableBodyPartSchema = z.discriminatedUnion(
  'partName',
  [circulationOnlyBodyPartSchema, csmCapableBodyPartSchema],
)
export type CirculationCapableBodyPart = z.infer<
  typeof circulationCapableBodyPartSchema
>

export const bodyPartSchema = z.discriminatedUnion('partName', [
  csmCapableBodyPartSchema,
  circulationOnlyBodyPartSchema,
  baseBodyPartSchema,
])
export type BodyPart = z.infer<typeof bodyPartSchema>
