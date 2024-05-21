import * as trpcExpress from '@trpc/server/adapters/express'
import 'dotenv/config'
import express from 'express'
import httpLogger from 'pino-http'

import logger from '@shared/util/logger'
import cookieParser from 'cookie-parser'
import path from 'path'
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
// Because the cookie parser is used to get the session manager
// In creation of tRPC context
app.use(cookieParser())

app.use(
  '/api/trpc',
  trpcExpress.createExpressMiddleware({ router: appRouter, createContext }),
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
