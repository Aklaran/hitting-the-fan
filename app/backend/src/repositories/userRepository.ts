import {
  CreateUserSchema,
  DeleteUserSchema,
  GetUserSchema,
} from '@shared/types/user'
import { Context } from '../lib/middleware/context'

const createUser = async (input: CreateUserSchema, ctx: Context) => {
  const user = await ctx.prisma.user.create({
    data: input,
  })

  return user
}

const getUsers = async (ctx: Context) => {
  const users = await ctx.prisma.user.findMany()

  return users
}

const getUser = async (input: GetUserSchema, ctx: Context) => {
  const user = await ctx.prisma.user.findUnique({
    where: { id: input.id },
  })

  return user
}

const deleteUser = async (input: DeleteUserSchema, ctx: Context) => {
  const user = await ctx.prisma.user.delete({
    where: { id: input.id },
  })

  return user
}

const userRepository = {
  createUser,
  getUsers,
  getUser,
  deleteUser,
}

export default userRepository
