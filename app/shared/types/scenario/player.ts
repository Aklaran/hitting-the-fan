import { z } from 'zod'
import { distanceSchema } from './environment'

export const wearableSchema = z.enum(['gloves', 'mask'])
export type Wearable = z.infer<typeof wearableSchema>

export const inventoryItemSchema = z.enum([
  ...wearableSchema.options,
  'thermometer',
])
export type InventoryItem = z.infer<typeof inventoryItemSchema>

export const playerSchema = z.object({
  distanceToPatient: distanceSchema,
  inventory: z.array(inventoryItemSchema),
  worn: z.array(wearableSchema),
  notes: z.string(),
  // TODO: Track whether the player is occupied (controlling spine, CPR)
})
export type Player = z.infer<typeof playerSchema>

