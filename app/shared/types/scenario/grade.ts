import { z } from 'zod'

export const gradeSchema = z.object({
  grade: z.enum(['A', 'B', 'C', 'D', 'F']),
  feedback: z.string(),
})

export type Grade = z.infer<typeof gradeSchema>
