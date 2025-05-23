import { controlTargetSchema, wearableSchema } from '@shared/types/scenario'
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
