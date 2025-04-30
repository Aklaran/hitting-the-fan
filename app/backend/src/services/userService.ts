import { Context } from '@backend/lib/middleware/context'
import userRepository from '@backend/repositories/userRepository'
import {
  CreateUserSchema,
  DeleteUserSchema,
  GetUserSchema,
} from '@shared/types/user'

const createUser = async (input: CreateUserSchema, ctx: Context) => {
  const createdUser = await userRepository.createUser(input, ctx)

  return createdUser
}

const getUsers = async (ctx: Context) => {
  const users = await userRepository.getUsers(ctx)

  return users
}

const getUser = async (input: GetUserSchema, ctx: Context) => {
  const user = await userRepository.getUser(input, ctx)

  return user
}

const deleteUser = async (input: DeleteUserSchema, ctx: Context) => {
  const user = await userRepository.deleteUser(input, ctx)

  return user
}

export const userService = {
  createUser,
  getUsers,
  getUser,
  deleteUser,
}
