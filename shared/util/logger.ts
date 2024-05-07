import pino, { LoggerOptions } from 'pino'

import { LogLevel } from '@shared/constants/logLevels'

//
// Log Level
//

// TODO: Enable log levels

// const DEFAULT_LOG_LEVEL_PROD = LogLevel.INFO;
// const DEFAULT_LOG_LEVEL_LOCAL = LogLevel.DEBUG;

// const isLocalEnvironment = environment === EnvironmentName.LOCAL;

// const DEFAULT_LOG_LEVEL = isLocalEnvironment
//   ? DEFAULT_LOG_LEVEL_LOCAL
//   : DEFAULT_LOG_LEVEL_PROD;

const logLevel = LogLevel.DEBUG

//
// Transport
//

// const PROD_TRANSPORT = {
//   target: "pino/file",
//   options: { destination: 1 },
// };

const LOCAL_TRANSPORT = {
  target: 'pino-pretty',
  options: {
    colorize: true,
  },
}

const transport = LOCAL_TRANSPORT

//
// Logger
//

const options: LoggerOptions = {
  level: logLevel,
  transport,
}

const logger = pino(options)

export default logger
