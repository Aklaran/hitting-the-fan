import { SessionManager } from '@kinde-oss/kinde-typescript-sdk'
import { PrismaClient } from '@prisma/client'
import User from '@shared/types/user'
import logger from '@shared/util/logger'
import * as trpcExpress from '@trpc/server/adapters/express'
import { kindeClient } from '../clients/kinde'
import { prismaClient } from '../clients/prisma'
import { sessionManager as sm } from '../clients/session'

// created for each request
export async function createContext({
  req,
}: trpcExpress.CreateExpressContextOptions) {
  const sessionManager = sm(req)

  const prisma = prismaClient

  const [isAuthenticated, user] = await getUser(sessionManager, prismaClient)

  const sessionId = req.session.id

  return {
    isAuthenticated,
    user,
    prisma,
    sessionId,
  }
}

async function getUser(
  sessionManager: SessionManager,
  prismaClient: PrismaClient,
): Promise<[boolean, User?]> {
  const isAuthenticated = await kindeClient.isAuthenticated(sessionManager)

  if (isAuthenticated) {
    return await getAuthenticatedUser(sessionManager, prismaClient)
  } else if (process.env.DEV_USER) {
    return await getDevUser(prismaClient)
  } else {
    return [false, undefined]
  }
}

async function getAuthenticatedUser(
  sessionManager: SessionManager,
  prismaClient: PrismaClient,
): Promise<[boolean, User?]> {
  try {
    const kindeUser = await kindeClient.getUser(sessionManager)
    logger.info(kindeUser, 'kinde user')

    // NOTE: Can't use service or repository cuz we'll make a circular reference
    let user = await prismaClient.user.findFirst({
      where: { authId: kindeUser.id },
    })

    if (!user) {
      user = await prismaClient.user.create({
        data: {
          authId: kindeUser.id,
          firstName: kindeUser.given_name,
          lastName: kindeUser.family_name,
          email: kindeUser.email,
        },
      })
    }

    logger.info(user, 'user')

    return [true, user]
  } catch (error) {
    logger.error(error, 'Error getting user in Context')

    return [false, undefined]
  }
}

async function getDevUser(
  prismaClient: PrismaClient,
): Promise<[boolean, User?]> {
  try {
    let user = await prismaClient.user.findUnique({ where: { id: 1 } })

    if (!user) {
      user = await prismaClient.user.create({
        data: {
          id: 1,
          authId: 'unauthenticated',
          firstName: 'dev',
          lastName: 'user',
          email: 'dev@hitting-the-fan.dev',
        },
      })
    }

    return [true, user]
  } catch (error) {
    logger.error(error, 'Error getting dev user in Context')

    return [false, undefined]
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
