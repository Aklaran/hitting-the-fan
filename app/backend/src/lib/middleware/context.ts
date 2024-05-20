import { SessionManager } from '@kinde-oss/kinde-typescript-sdk'
import logger from '@shared/util/logger'
import * as trpcExpress from '@trpc/server/adapters/express'
import { kindeClient, sessionManager as sm } from './kinde'

async function getUser(sessionManager: SessionManager) {
  try {
    const user = await kindeClient.getUser(sessionManager)
    return user
  } catch (error) {
    logger.error('Error getting user', error)
    return null
  }
}

// created for each request
export async function createContext({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) {
  const sessionManager = sm(req, res)

  const isAuthenticated = await kindeClient.isAuthenticated(sessionManager)

  const user = isAuthenticated ? await getUser(sessionManager) : null

  return {
    isAuthenticated,
    user,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
