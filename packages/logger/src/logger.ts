/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  createConsoleStream,
} from './console-stream.js'
import {
  createPrettyStream,
} from './pretty-stream.js'
import {
  createSentryBrowserStream,
} from './sentry-browser-stream.js'
import {
  createSentryNodeStream,
} from './sentry-node-stream.js'
import {
  createStdStream,
} from './std-stream.js'
import {
  type LoggerConfig,
  type LoggerOptions,
  type StreamOptions,
} from './types.js'
import SentryBrowser from '@sentry/browser'
import SentryNode from '@sentry/node'
import {
  type ClientOptions,
} from '@sentry/types'
import {
  type BaseLogger,
  type Bindings,
  type ChildLoggerOptions,
  type Level,
  type LevelWithSilent,
  type LogFn,
  type Logger as PinoLogger,
  pino,
} from 'pino'

const isSentryDebug = process.env['SENTRY_DEBUG'] === 'true'

export class Logger implements BaseLogger {
  private readonly logger: PinoLogger

  readonly #sentryInstance: typeof SentryBrowser | typeof SentryNode | undefined

  readonly #streamOptions: StreamOptions[] = []

  constructor(config: LoggerConfig) {
    // если указан несуществующий уровень логирования, то устанавливаем уровень по умолчанию
    if (!(['debug', 'error', 'fatal', 'info', 'trace', 'warn'] as Level[]).includes(config.level)) {
      config.level = 'info'
    }
    this.#streamOptions = config.streamsOptions ?? []
    const options: LoggerOptions = config.options ?? {}
    options.name = config.name
    options.level = config.level

    if (config.isPretty) {
      this.#streamOptions.push(createPrettyStream(config.level))
    } else if (config.isBrowser) {
      this.#streamOptions.push(createConsoleStream(config.level))
    } else {
      this.#streamOptions.push(createStdStream(config.level))
    }

    if (config.dsn) {
      /** @see https://stackoverflow.com/questions/51995925/node-fetch-request-fails-on-server-unable-to-get-local-issuer-certificate */
      process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
      const options: Partial<ClientOptions> = {
        dsn: config.dsn,
        debug: true,
        release: process.env['SENTRY_RELEASE'] ?? 'without release',
        initialScope: {
          tags: {
            branch: process.env['GIT_BRANCH_NAME'] ?? 'local',
          },
        },
        beforeSend: (event, hint) => {
          if (hint.data?.mechanism?.handled === false) {
            event.tags = {
              ...event.tags,
              unhandled_exception: 'true',
            }
            event.fingerprint = ['unhandled_exception', process.env['GIT_BRANCH_NAME'] ?? 'local', new Date().toISOString().slice(0, 10), ...event.fingerprint ?? []]
          } else {
            event.tags = {
              ...event.tags,
              unhandled_exception: 'false',
            }
          }
          return event
        },
      }
      if (config.isBrowser) {
        this.#sentryInstance = SentryBrowser
        this.#streamOptions.push(createSentryBrowserStream('warn', {
          ...options,
          debug: isSentryDebug,
        }))
      } else {
        this.#sentryInstance = SentryNode
        this.#streamOptions.push(createSentryNodeStream(
          'warn',
          {
            ...options,
            maxValueLength: 10_000,
            debug: isSentryDebug,
          },
        ))
      }
    }

    this.logger = pino(options, pino.multistream(this.#streamOptions))
  }

  public get streams(): {level?: Level | undefined; stream: NodeJS.WritableStream}[] {
    return this.#streamOptions.map((it) => ({
      level: it.level,
      stream: it.stream as NodeJS.WritableStream,
    }))
  }

  public get level(): LevelWithSilent | string {
    return this.logger.level
  }

  public set level(value: LevelWithSilent | string) {
    this.logger.level = value
  }

  public silent: LogFn = (arg1: any, arg2: any, ...args: any[]): void => {
    this.logger.silent(arg1, arg2, ...args)
  }

  public trace: LogFn = (arg1: any, arg2: any, ...args: any[]): void => {
    this.logger.trace(arg1, arg2, ...args)
  }

  public debug: LogFn = (arg1: any, arg2: any, ...args: any[]): void => {
    this.logger.debug(arg1, arg2, ...args)
  }

  public info: LogFn = (arg1: any, arg2: any, ...args: any[]): void => {
    this.logger.info(arg1, arg2, ...args)
  }

  public warn: LogFn = (arg1: any, arg2: any, ...args: any[]): void => {
    this.logger.warn(arg1, arg2, ...args)
  }

  public error: LogFn = (arg1: any, arg2: any, ...args: any[]): void => {
    this.logger.error(arg1, arg2, ...args)
  }

  public fatal: LogFn = (arg1: any, arg2: any, ...args: any[]): void => {
    this.logger.fatal(arg1, arg2, ...args)
  }

  public child(bindings: Bindings, options?: ChildLoggerOptions): PinoLogger {
    return this.logger.child(bindings, options)
  }

  public setTags(error: Error, tags: Record<string, string>): Error & {extraTags: Record<string, string>} {
    const errorWithTags = error as Error & {extraTags: Record<string, string>}
    errorWithTags.extraTags = tags
    return errorWithTags
  }

  public captureMessage(message: string, tags: Record<string, string> = {}): void {
    if (this.#sentryInstance) {
      this.#sentryInstance.captureMessage(message, {tags})
    }
    this.debug(message)
  }
}
