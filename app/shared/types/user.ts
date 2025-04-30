import { z } from 'zod'

export const userSchema = z.object({
  id: z.number().int().positive().min(1),
  authId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
})

export const createUserSchema = userSchema.omit({ id: true })
export const getUserSchema = userSchema.partial()
export const deleteUserSchema = userSchema.pick({ id: true })

type User = z.infer<typeof userSchema>
export type CreateUserSchema = z.infer<typeof createUserSchema>
export type GetUserSchema = z.infer<typeof getUserSchema>
export type DeleteUserSchema = z.infer<typeof deleteUserSchema>

export type UserId = z.infer<typeof userSchema.shape.id>

export default User
