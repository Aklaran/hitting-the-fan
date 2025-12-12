import { z } from 'zod'

export const gradeSchema = z.object({
  grade: z.enum(['A', 'B', 'C', 'D', 'F']),
  feedback: z.string(),
})

export type Grade = z.infer<typeof gradeSchema>

export const gradingResultSchema = z.object({
  score: z.number().min(0).max(100),
  matchedActions: z.number().int().min(0),
  totalPerfectActions: z.number().int().min(0),
  badActionsCount: z.number().int().min(0),
  orderBonus: z.number().min(0),
  feedback: z.array(z.string()),
})

export type GradingResult = z.infer<typeof gradingResultSchema>
