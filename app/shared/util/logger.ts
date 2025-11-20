import pino, { LoggerOptions } from 'pino'

import { LogLevel } from '@shared/constants/logLevels'

//
// Log Level
//

const isDevelopment = process.env.NODE_ENV !== 'production'

// Get log level from environment variable, or default based on environment
const getLogLevel = (): LogLevel => {
  const envLogLevel = process.env.LOG_LEVEL?.toLowerCase()

  // If LOG_LEVEL is set, validate and use it
  if (envLogLevel) {
    const validLevels = Object.values(LogLevel) as string[]
    if (validLevels.includes(envLogLevel)) {
      return envLogLevel as LogLevel
    }
    // If invalid, warn and fall back to default
    console.warn(
      `Invalid LOG_LEVEL "${envLogLevel}". Valid levels are: ${validLevels.join(', ')}. Falling back to default.`,
    )
  }

  // Default based on environment
  return isDevelopment ? LogLevel.DEBUG : LogLevel.INFO
}

const logLevel = getLogLevel()

//
// Transport
//

const getTransport = () => {
  if (isDevelopment) {
    return {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    }
  }

  // Production: use both pino-pretty (stdout) and file transport
  const logFilePath = process.env.LOG_FILE_PATH || '/var/log/htf/htf.log'

  return {
    targets: [
      {
        target: 'pino-pretty',
        options: {
          colorize: true,
          destination: 1, // stdout
        },
      },
      {
        target: 'pino/file',
        options: {
          destination: logFilePath,
          mkdir: true, // Create directory if it doesn't exist
        },
      },
    ],
  }
}

const transport = getTransport()

//
// Logger
//

const options: LoggerOptions = {
  level: logLevel,
  transport,
}

const logger = pino(options)

export default logger
