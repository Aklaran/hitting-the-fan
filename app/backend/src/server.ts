import bodyParser from 'body-parser'
import express from 'express'
import httpLogger from 'pino-http'

import flashcardsRoute from '@backend/routes/flashcards'
import logger from '@shared/util/logger'
import path from 'path'

const app = express()
const port = 3000

// TODO: Can I move this into a different file?
app.use(
  httpLogger({
    logger,
    customReceivedMessage: function (req) {
      return `${req.method} ${req.url}`
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
          url: req.url,
        }
      },
    },
  }),
)

app.use(bodyParser.json())

app.use('/api/flashcards', flashcardsRoute)

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
