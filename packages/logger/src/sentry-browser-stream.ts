import {
  ExtendedError,
} from './extended-error.ts'
import {
  convertPinoLevelToSentrySeverityLevel,
} from './severity.ts'
import {
  type StreamOptions,
  StreamTypes,
} from './types.ts'
import Sentry, {
  type BrowserOptions,
} from '@sentry/browser'
import {
  type Level,
  type LogDescriptor,
} from 'pino'

export const createSentryBrowserStream = (level: Level, options: BrowserOptions): StreamOptions => {
  if (!Sentry.getCurrentHub().getClient()) {
    Sentry.init({...options})
  }
  return {
    level,
    type: StreamTypes.SENTRY_BROWSER,
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
            if (msg) {
              scope.setFingerprint([msg, level, process.env['GIT_BRANCH_NAME'], new Date().toISOString().slice(0, 10)])
            }
            if (err) {
              if (err.extraTags instanceof Object) {
                Object.entries(err.extraTags).forEach(([key, value]) => {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                  scope.setTag(key, `${value}`)
                })
              }
              if (msg) {
                err.message = `${msg}\n${err.message}`
              }
              Sentry.captureException(new ExtendedError(err))
            } else {
              Sentry.captureMessage(extra['msg'] ?? record)
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
