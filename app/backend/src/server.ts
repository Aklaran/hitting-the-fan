import * as trpcExpress from '@trpc/server/adapters/express'
import { configDotenv } from 'dotenv'
import express from 'express'
import fs from 'fs'
import path from 'path'
import httpLogger from 'pino-http'

// In production (Docker), env vars are injected by docker-compose's env_file
// In development, load from .env file if it exists
// This has to be called as early as possible (before session import)
// So necessary env vars are provided to session options during local debugging
const envPath = path.join(__dirname, '../../../.env')
if (fs.existsSync(envPath)) {
  configDotenv({ path: envPath })
}

import logger from '@shared/util/logger'
import session from 'express-session'
import { sessionOptions } from './lib/clients/session'
import { createContext } from './lib/middleware/context'
import authRouter from './routes/auth'
import appRouter from './routes/root'

const app = express()

// This has to come first so it gets raw HTTP logs.
app.use(
  httpLogger({
    logger,
    customReceivedMessage: function (req) {
      return `${req.method} ${decodeURIComponent(req.url)}`
    },

    customSuccessMessage: function (req, res) {
      return `${req.method} ${res.statusCode}`
    },

    customSuccessObject: (_req, _res, val) => {
      return {
        responseTime: val.responseTime,
      }
    },

    customErrorMessage: function (req, res) {
      return `${req.method} ${res.statusCode}`
    },

    customErrorObject: (_req, _res, _error, val) => {
      return {
        responseTime: val.responseTime,
      }
    },

    // TODO: Consider logging the full request object in production & only
    //       simplifying like here in the local environment
    // Customize the request object to be the bare minimum so that logs aren't so spammy
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: decodeURIComponent(req.url),
        }
      },
    },
  }),
)

// This has to come before tRPC middleware
// Because session has to exist before tRPC can use it
app.use(session(sessionOptions))

app.use(
  '/api/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
    onError: ({ error, req, path, type, input, ctx }) => {
      logger.error({
        error: {
          message: error.message,
          code: error.code,
          stack: error.stack,
          cause: error.cause?.message,
        },
        req: {
          id: req.id,
          method: req.method,
          url: decodeURIComponent(req.url),
        },
        path,
        type,
        input,
        userId: ctx?.user?.id,
        sessionId: ctx?.sessionId,
      })
    },
  }),
)

// Kinde Auth

app.use('/api/auth', authRouter)

// Serve frontend via static files
// TODO: Can I move this into a different file?

// TODO: Can I use ts path aliases for this?
const distPath = path.join(__dirname, '../../frontend/dist')

app.use(express.static(distPath))
app.use(express.static(path.join(distPath, 'index.html')))

app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

// -------------------------------

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
