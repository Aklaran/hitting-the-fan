import { SessionManager } from '@kinde-oss/kinde-typescript-sdk'
import logger from '@shared/util/logger'
import * as trpcExpress from '@trpc/server/adapters/express'
import { kindeClient } from '../clients/kinde'
import { prismaClient } from '../clients/prisma'
import { sessionManager as sm } from '../clients/session'

async function getUser(sessionManager: SessionManager) {
  try {
    const user = await kindeClient.getUser(sessionManager)

    logger.info(user, 'User')

    return user
  } catch (error) {
    logger.error(error, 'Error getting user')

    return null
  }
}

// created for each request
export async function createContext({
  req,
}: trpcExpress.CreateExpressContextOptions) {
  const sessionManager = sm(req)

  const isAuthenticated = await kindeClient.isAuthenticated(sessionManager)

  const user = isAuthenticated ? await getUser(sessionManager) : null

  const prisma = prismaClient

  const sessionId = req.session.id

  return {
    isAuthenticated,
    user,
    prisma,
    sessionId,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
