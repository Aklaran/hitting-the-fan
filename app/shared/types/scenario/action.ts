import { z } from 'zod'
import { commandSchema, modifierSchema, verbSchema } from './command'
import { scenarioStateSchema } from './state'

export const actionResultSchema = z.enum([
  'success',
  'parse_failure',
  'invalid_command',
  'guard_failure',
  'unexpected_error',
])
export type ActionResult = z.infer<typeof actionResultSchema>

export const actionResponseSchema = z.object({
  responseText: z.string(),
  scenarioState: scenarioStateSchema,
  result: actionResultSchema.default('success'),
})
export type ActionResponse = z.infer<typeof actionResponseSchema>

export const createCommandResultSchema = z.discriminatedUnion('result', [
  z.object({
    result: z.literal('success'),
    command: commandSchema,
  }),
  z.object({
    result: z.literal('parse_failure'),
    response: actionResponseSchema,
  }),
])
export type CreateCommandResult = z.infer<typeof createCommandResultSchema>

export const verbHandlerSchema = z.object({
  execute: z
    .function()
    .args(commandSchema, scenarioStateSchema)
    .returns(actionResponseSchema),
})
export type VerbHandler = z.infer<typeof verbHandlerSchema>

export const actionLogSchema = z.object({
  timestamp: z.date(),
  userId: z.number().int().positive().min(1),
  sessionId: z.string(),
  scenarioId: z.number().int().positive().min(1),

  rawInput: z.string(),
  verb: verbSchema,
  objectType: z.string(),
  modifiers: z.array(modifierSchema).optional(),
  actionResult: actionResultSchema,
  narratorResponse: z.string(),

  duration: z.number().int().positive(),
})
export type ActionLog = z.infer<typeof actionLogSchema>
