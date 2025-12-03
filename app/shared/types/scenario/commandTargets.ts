import { z } from 'zod'
import { baseBodyPartSchema } from './bodyPart'
import { patientSchema } from './patient'

export const directionSchema = z.enum(['in'])
export type Direction = z.infer<typeof directionSchema>

export const moveTargetSchema = z.union([directionSchema, patientSchema])
export type MoveTarget = z.infer<typeof moveTargetSchema>

export const questionTargetSchema = z.enum([
  'name',
  'age',
  'gender',
  'injury',
  'medicalTags',
  'whatHappened',
  'time',
  'place',
  'allergies',
  'medications',
  'lastIntakeOutput',
  'diabetes',
  'asthma',
  'seizures',
  'heartConditions',
  'chiefComplaint',
  'onset',
  'provokers',
  'palliatives',
  'quality',
  'region',
  'radiation',
  'referral',
  'severity',
  'intensityTrend',
  'normality',
  'happenedBefore',
  'mechanismOfInjury',
])
export type QuestionTarget = z.infer<typeof questionTargetSchema>

export const instructTargetSchema = z.enum([
  'dontMove',
  'acceptCare',
  'breathe',
])
export type InstructTarget = z.infer<typeof instructTargetSchema>

export const performTargetSchema = z.enum([
  'bloodSweep',
  'focusedSpineAssessment',
  'passiveRangeOfMotionAssessment',
  'activeRangeOfMotionAssessment',
  'activityRangeOfMotionAssessment',
])
export type PerformTarget = z.infer<typeof performTargetSchema>

export const measureTargetSchema = z.enum([
  'respiration',
  'pulse',
  'pupils',
  'sensation',
  'motion',
  'skinTemperature',
  'skinColor',
  'skinMoisture',
  'temperature',
])
export type MeasureTarget = z.infer<typeof measureTargetSchema>

export const removeTargetSchema = z.enum(['obstruction'])
export type RemoveTarget = z.infer<typeof removeTargetSchema>

export const controlTargetSchema = baseBodyPartSchema.refine(
  (bodyPart) => bodyPart.partName === 'spine' || bodyPart.partName === 'head',
  {
    message: "Body part must be 'spine' or 'head'",
  },
)
export type ControlTarget = z.infer<typeof controlTargetSchema>

export const viewableSchema = z.object({
  description: z.string(),
})
export type Viewable = z.infer<typeof viewableSchema>
