import { createLogger, format, transports } from 'winston'

const { combine, timestamp, printf, errors } = format

// Define log levels in the order of severity
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  trace: 4,
}

const LOG_LEVEL = process.env.LOG_LEVEL || 'info'
const LOG_FORMAT = process.env.LOG_FORMAT || 'text' // 'text' or 'json'

const textFormat = printf(({ level, message, timestamp, context, data }) => {
  const contextStr = context ? `[${context}] ` : ''
  let output = `${timestamp} [${level.toUpperCase()}] ${contextStr}${message}`

  if (data) {
    output += '\n' + JSON.stringify(data, null, 2)
  }

  return output
})

const jsonFormat = printf(({ timestamp, level, message, context, data }) => {
  const logEntry = {
    timestamp,
    level,
    message,
    ...(context && { context }),
    ...(data && { data })
  }

  return JSON.stringify(logEntry)
})

const newLogger = createLogger({
  levels: logLevels,
  level: LOG_LEVEL,
  format: combine(
    timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
    errors({ stack: true })
  ),
  transports: [
    new transports.Console({
      format: LOG_FORMAT === 'json' ? jsonFormat : textFormat,
      handleExceptions: true,
      handleRejections: true
    })
  ],
  exitOnError: false
})

function logMessage(level, message, data = null, context = null) {
  // Only log if the level is enabled
  if (!newLogger.isLevelEnabled(level)) {
    return
  }

  newLogger.log(level, {
    message,
    context,
    data
  })
}

const logger = {
  error: (message, data, context) => logMessage('error', message, data, context),
  warn: (message, data, context) => logMessage('warn', message, data, context),
  info: (message, data, context) => logMessage('info', message, data, context),
  debug: (message, data, context) => logMessage('debug', message, data, context),
  trace: (message, data, context) => logMessage('trace', message, data, context),
}

export default logger