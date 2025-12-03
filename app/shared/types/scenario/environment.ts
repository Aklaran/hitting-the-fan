import { z } from 'zod'

export const environmentSchema = z.object({
  description: z.string(),
  temperatureCelsius: z.number().int().min(-40).max(45),
  hazards: z.array(z.string()),
  time: z.string(),
  place: z.string(),
})
export type Environment = z.infer<typeof environmentSchema>

export const distanceSchema = z.enum(['near', 'far'])
export type Distance = z.infer<typeof distanceSchema>

