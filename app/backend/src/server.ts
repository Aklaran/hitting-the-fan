import bodyParser from 'body-parser'
import express from 'express'
import httpLogger from 'pino-http'

import flashcardsRoute from '@backend/routes/flashcards'
import logger from '@shared/util/logger'

const app = express()
const port = 3000

app.use(
  httpLogger({
    logger,
    customReceivedMessage: function (req) {
      return `${req.method} ${req.url}`
    },

    customSuccessMessage: function (req, res) {
      return `${req.method} ${res.statusCode}`
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    customSuccessObject: (_req, _res, val) => {
      return {
        responseTime: val.responseTime,
      }
    },

    customErrorMessage: function (req, res) {
      return `${req.method} ${res.statusCode}`
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

app.get('/', (_, res) => {
  res.send('Hello, Saturn!')
})

app.listen(port, () => {
  console.log('Server is running on port 3000')
})

app.use('/api/flashcards', flashcardsRoute)
