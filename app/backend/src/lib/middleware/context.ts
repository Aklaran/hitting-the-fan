import { SessionManager } from '@kinde-oss/kinde-typescript-sdk'
import { PrismaClient } from '@prisma/client'
import User from '@shared/types/user'
import logger from '@shared/util/logger'
import { TRPCError } from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'
import { kindeClient } from '../clients/kinde'
import { prismaClient } from '../clients/prisma'
import {
  ExtendedSessionManager,
  sessionManager as sm,
} from '../clients/session'

// created for each request
export async function createContext({
  req,
}: trpcExpress.CreateExpressContextOptions) {
  const sessionManager = sm(req)

  const prisma = prismaClient

  const sessionId = req.sessionID

  const [isAuthenticated, user] = await getUser(
    sessionManager,
    req,
    prismaClient,
  )

  return {
    isAuthenticated,
    user,
    prisma,
    sessionId,
  }
}

async function getUser(
  sessionManager: ExtendedSessionManager,
  req: Express.Request,
  prismaClient: PrismaClient,
): Promise<[boolean, User]> {
  const isAuthenticated = await kindeClient.isAuthenticated(sessionManager)

  if (isAuthenticated) {
    return await getAuthenticatedUser(sessionManager, prismaClient)
  } else {
    return await getAnonymousUser(sessionManager, req, prismaClient)
  }
}

async function getAuthenticatedUser(
  sessionManager: SessionManager,
  prismaClient: PrismaClient,
): Promise<[boolean, User]> {
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

      // TODO: Consider cleaning up orphaned anonymous users on first login
      // (users with authId: null that previously owned this session)
      // For now, leaving them in place—can migrate or delete later based on UX needs.
    }

    logger.info(user, 'user')

    return [true, user]
  } catch (error) {
    logger.error('Error fetching authenticated user:', error)
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to retrieve authenticated user.',
    })
  }
}

async function getAnonymousUser(
  sessionManager: ExtendedSessionManager,
  req: Express.Request,
  prismaClient: PrismaClient,
): Promise<[boolean, User]> {
  return prismaClient.$transaction(async (tx) => {
    let session = await tx.session.findUnique({
      where: { sid: req.sessionID },
    })

    if (!session) {
      // Force expression-session to create a session
      await sessionManager.saveSession()
      session = await tx.session.findUnique({
        where: { sid: req.sessionID },
      })

      if (!session) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create session for anonymous user.',
        })
      }
    }

    if (session.userId) {
      const existingUser = await tx.user.findUnique({
        where: { id: session.userId },
      })

      if (!existingUser) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            'Failed to retrieve anonymous user from session ID. Referential integrity error.',
        })
      }

      return [false, existingUser]
    }

    const user = await tx.user.create({})
    await tx.session.update({
      where: { sid: session.sid },
      data: { userId: user.id },
    })
    sessionManager.setSessionItem('userId', user.id)

    return [false, user]
  })
}

export type Context = Awaited<ReturnType<typeof createContext>>
