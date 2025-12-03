import { z } from 'zod'
import { ailmentSchema } from './ailment'
import { bodyPartSchema } from './bodyPart'
import { distanceSchema } from './environment'
import {
  effortSchema,
  levelOfResponsivenessSchema,
  pupilSchema,
  rhythmSchema,
  skinSchema,
} from './vitals'

export const medicalTagSchema = z.object({
  description: z.string(),
})
export type MedicalTag = z.infer<typeof medicalTagSchema>

export const positionSchema = z.enum([
  'standing',
  'seated',
  'supine',
  'prone',
  'rightLateralRecumbent',
  'leftLateralRecumbent',
])
export type Position = z.infer<typeof positionSchema>

export const medicationSchema = z.enum(['zyrtec', 'advil', 'aspirin'])
export type Medication = z.infer<typeof medicationSchema>

export const allergySchema = z.enum([
  ...medicationSchema.options,
  'dogs',
  'cats',
])
export type Allergy = z.infer<typeof allergySchema>

export const patientSchema = z.object({
  name: z.string(),
  descriptions: z.object({
    [distanceSchema.Enum.near]: z.string(),
    [distanceSchema.Enum.far]: z.string(),
  }),
  age: z.number().int().nonnegative().max(100),
  gender: z.enum(['male', 'female', 'other']),
  temperatureFahrenheit: z.number().nonnegative().max(116),
  circulation: z.object({
    rate: z.number().int().nonnegative().max(200),
    rhythm: rhythmSchema,
  }),
  respiration: z.object({
    rate: z.number().int().nonnegative().max(60),
    rhythm: rhythmSchema,
    effort: effortSchema,
  }),
  skin: skinSchema,
  pupils: pupilSchema,
  levelOfResponsiveness: levelOfResponsivenessSchema,
  coreTemperatureCelsius: z.number().int().nonnegative().max(45),
  bodyParts: z.array(bodyPartSchema),
  ailments: z.array(ailmentSchema),
  instructions: z.object({
    dontMove: z.boolean(),
    acceptCare: z.boolean(),
    breathe: z.boolean(),
  }),
  isSpineControlled: z.boolean(),
  medicalTag: medicalTagSchema.optional(),
  events: z.string(),
  position: positionSchema,
  allergies: allergySchema.array(),
  medications: medicationSchema.array(),
  lastIntakeOutput: z.string(),
  hasDiabetes: z.boolean(),
  hasAsthma: z.boolean(),
  hasSeizures: z.boolean(),
  hasHeartConditions: z.boolean(),
})
export type Patient = z.infer<typeof patientSchema>
