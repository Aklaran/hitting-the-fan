import { z } from 'zod'

export const motionSchema = z.enum(['normal', 'tremor', 'immobile'])
export type Motion = z.infer<typeof motionSchema>

export const MOTION_PRIORITIES: Record<Motion, number> = {
  immobile: 0,
  tremor: 1,
  normal: 2,
}

export const obstructionSchema = z.enum(['obstructed', 'unobstructed'])
export type Obstruction = z.infer<typeof obstructionSchema>

export const OBSTRUCTION_PRIORITIES: Record<Obstruction, number> = {
  obstructed: 0,
  unobstructed: 1,
}

// Lower value == higher priority
// This is to allow for more values to be added without changing the map.
export const PULSE_QUALITY_PRIORITIES = {
  absent: 0,
  weak: 1,
  bounding: 2,
  strong: 3,
} as const

export const pulseQualitySchema = z.enum([
  'absent',
  'weak',
  'bounding',
  'strong',
])
export type PulseQuality = z.infer<typeof pulseQualitySchema>

export const circulationSchema = z.object({
  quality: pulseQualitySchema,
})
export type Circulation = z.infer<typeof circulationSchema>

export const rhythmSchema = z.enum(['regular', 'irregular'])
export type Rhythm = z.infer<typeof rhythmSchema>

export const RHYTHM_PRIORITIES: Record<Rhythm, number> = {
  irregular: 0,
  regular: 1,
}

export const effortSchema = z.enum(['easy', 'labored'])
export type Effort = z.infer<typeof effortSchema>

export const EFFORT_PRIORITIES: Record<Effort, number> = {
  labored: 0,
  easy: 1,
}

export const skinTemperatureSchema = z.enum(['warm', 'cool', 'hot'])
export type SkinTemperature = z.infer<typeof skinTemperatureSchema>

export const SKIN_TEMPERATURE_PRIORITIES: Record<SkinTemperature, number> = {
  hot: 0,
  cool: 1,
  warm: 2,
}

export const skinColorSchema = z.enum(['pink', 'pale', 'red', 'ashen'])
export type SkinColor = z.infer<typeof skinColorSchema>

export const SKIN_COLOR_PRIORITIES: Record<SkinColor, number> = {
  ashen: 0,
  red: 1,
  pale: 2,
  pink: 3,
}

export const skinMoistureSchema = z.enum(['dry', 'moist', 'clammy', 'wet'])
export type SkinMoisture = z.infer<typeof skinMoistureSchema>

export const SKIN_MOISTURE_PRIORITIES: Record<SkinMoisture, number> = {
  wet: 0,
  clammy: 1,
  moist: 2,
  dry: 3,
}

export const skinSchema = z.object({
  temperature: skinTemperatureSchema,
  color: skinColorSchema,
  moisture: skinMoistureSchema,
})
export type Skin = z.infer<typeof skinSchema>

export const pupilShapeSchema = z.enum(['round', 'not... round?'])
export type PupilShape = z.infer<typeof pupilShapeSchema>

export const PUPIL_SHAPE_PRIORITIES: Record<PupilShape, number> = {
  'not... round?': 0,
  round: 1,
}

export const pupilEqualitySchema = z.enum(['equal', 'unequal'])
export type pupilEquality = z.infer<typeof pupilEqualitySchema>

export const PUPIL_EQUALITY_PRIORITIES: Record<pupilEquality, number> = {
  unequal: 0,
  equal: 1,
}

export const pupilReactivitySchema = z.enum([
  'reactive',
  'late reactive',
  'unreactive',
])
export type PupilReactivity = z.infer<typeof pupilReactivitySchema>

export const PUPIL_REACTIVITY_PRIORITIES: Record<PupilReactivity, number> = {
  unreactive: 0,
  'late reactive': 1,
  reactive: 2,
}

export const pupilSchema = z.object({
  shape: pupilShapeSchema,
  equality: pupilEqualitySchema,
  reactivity: pupilReactivitySchema,
})

export type Pupil = z.infer<typeof pupilSchema>

export const sensationSchema = z.enum([
  'absent',
  'numb',
  'tingling',
  'cold',
  'hot',
  'normal',
])
export type Sensation = z.infer<typeof sensationSchema>

// Lower value == higher priority
// This is to allow for more values to be added without changing the map.
export const SENSATION_PRIORITIES: Record<Sensation, number> = {
  absent: 0,
  numb: 1,
  tingling: 2,
  cold: 3,
  hot: 4,
  normal: 5,
}

export const csmSchema = z.union([
  motionSchema,
  sensationSchema,
  pulseQualitySchema,
])
export type CSM = z.infer<typeof csmSchema>

export const levelOfResponsivenessSchema = z.enum([
  'U', // unresponsive
  'P', // not awake. responds only to painful stimulus
  'V', // not awake. responds only to verbal stimulus
  'AO0', // awake, but not oriented.
  'AO1', // awake and oriented to Person
  'AO2', // awake and oriented to Person, Place
  'AO3', // awake and oriented to Person, Place, Time
  'AO4', // awake and oriented to Person, Place, Time, and Events
])
export type LevelOfResponsiveness = z.infer<typeof levelOfResponsivenessSchema>

export const LOR_VALUES: Record<LevelOfResponsiveness, number> = {
  U: 0,
  P: 1,
  V: 2,
  AO0: 3,
  AO1: 4,
  AO2: 5,
  AO3: 6,
  AO4: 7,
} as const
