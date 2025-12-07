import { z } from 'zod'
import { ailmentSchema } from './ailment'
import { bodyPartNames, bodyPartSchema } from './bodyPart'
import {
  applyTargetSchema,
  controlTargetSchema,
  instructTargetSchema,
  measureTargetSchema,
  moveTargetSchema,
  performTargetSchema,
  questionTargetSchema,
  removeTargetSchema,
} from './commandTargets'
import { environmentSchema } from './environment'
import { patientSchema, positionSchema } from './patient'
import { inventoryItemSchema } from './player'

export const verbSchema = z.enum([
  'look',
  'ask',
  'instruct',
  'palpate',
  'measure',
  'move',
  'survey',
  'wear',
  'control',
  'remove',
  'perform',
  'apply',
])
export type Verb = z.infer<typeof verbSchema>

export const modifierSchema = z.enum([
  'remove',
  'loose',
  'tight',
  'obstruction',
  // HACK: Is there a better way to unwrap these nested zod enums?
  ...bodyPartNames.options[0].options,
  ...bodyPartNames.options[1].options,
  ...bodyPartNames.options[2].options,
  ...positionSchema.options,
])
export type Modifier = z.infer<typeof modifierSchema>

export const nounSchema = z.enum([
  'patient',
  'leg',
  'name',
  'environment',
  // HACK: Is there a better way to nested unwrap these zod enums?
  ...bodyPartNames.options[0].options,
  ...bodyPartNames.options[1].options,
  ...bodyPartNames.options[2].options,
  'pulse',
  'respiratoryRate',
  'in',
  'hazards',
  'mechanismOfInjury',
  ...questionTargetSchema.options,
  ...instructTargetSchema.options,
  ...performTargetSchema.options,
  ...removeTargetSchema.options,
  ...measureTargetSchema.options,
  ...applyTargetSchema.options,
])
export type Noun = z.infer<typeof nounSchema>

export const commandObjectSchema = z.union([
  patientSchema,
  environmentSchema,
  ailmentSchema,
  bodyPartSchema,
  questionTargetSchema,
  instructTargetSchema,
  controlTargetSchema,
  performTargetSchema,
  removeTargetSchema,
  moveTargetSchema,
  measureTargetSchema,
  inventoryItemSchema,
  applyTargetSchema,
])
export type CommandObject = z.infer<typeof commandObjectSchema>

export const commandSchema = z.object({
  verb: verbSchema,
  object: commandObjectSchema.optional(),
  modifiers: z.array(modifierSchema).optional(),
})
export type Command = z.infer<typeof commandSchema>

export const processActionSchema = z.object({
  action: z.string(),
})
export type ProcessAction = z.infer<typeof processActionSchema>

export const updatePlayerNotesInputSchema = z.object({
  notes: z
    .string()
    .max(1000, { message: 'Notes must be less than 1000 characters' }),
})
export type UpdatePlayerNotesInput = z.infer<
  typeof updatePlayerNotesInputSchema
>

export const updateSoapNoteInputSchema = z.object({
  soapNote: z
    .string()
    .max(1000, { message: 'SOAP Note must be less than 1000 characters' }),
})
export type UpdateSoapNoteInput = z.infer<typeof updateSoapNoteInputSchema>
