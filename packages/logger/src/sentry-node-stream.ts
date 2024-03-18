import {
  ExtendedError,
} from './extended-error.js'
import {
  convertPinoLevelToSentrySeverityLevel,
} from './severity.js'
import {
  type StreamOptions,
  StreamTypes,
} from './types.js'
import Sentry, {
  type NodeOptions,
} from '@sentry/node'
import {
  type Primitive,
} from '@sentry/types'
import {
  type Level,
  type LogDescriptor,
} from 'pino'

export const createSentryNodeStream = (loggerLevel: Level, options: NodeOptions): StreamOptions => {
  if (!Sentry.getCurrentHub().getClient()) {
    Sentry.init({...options})
  }

  return {
    level: loggerLevel,
    type: StreamTypes.SENTRY_NODE,
    stream: {
      write(record: string): void {
        try {
          const {
            level,
            err,
            msg,
            ...extra
          } = JSON.parse(record) as LogDescriptor
          Sentry.withScope((scope) => {
            scope.setLevel(convertPinoLevelToSentrySeverityLevel(level))
            scope.setExtras(extra)
            if (err) {
              if (err.extraTags instanceof Object) {
                Object.entries(err.extraTags).forEach(([key, value]) => {
                  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                  scope.setTag(key, `${value}`)
                })
              }
              if (msg) {
                err.message = `${msg}\n${err.message}`
                scope.setFingerprint([msg, level, process.env['GIT_BRANCH_NAME'], new Date().toISOString().slice(0, 10)])
              }
              Sentry.captureException(new ExtendedError(err))
            } else {
              Sentry.captureMessage(msg ?? record)
            }
          })
        } catch (error: unknown) {
          if (error instanceof Error) {
            error.message = `${record} ${error.message}`
          }
          console.error(error)
        }
      },
    },
  }
}

export const sendSentryMessage = (message: string, tags: Record<string, Primitive> = {}): void => {
  Sentry.captureMessage(message, {extra: {tags}})
}
