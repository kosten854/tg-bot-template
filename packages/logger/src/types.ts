/* eslint-disable @typescript-eslint/naming-convention */
import {
  type DestinationStream,
  type Level,
  type LoggerOptions as PinoLoggerOptions,
} from 'pino'

export {
  type Level,
} from 'pino'

export type LoggerOptions = Omit<PinoLoggerOptions, 'transport'>

export enum StreamTypes {
  CONSOLE = 'CONSOLE',
  PRETTY = 'PRETTY',
  SENTRY_BROWSER = 'SENTRY_BROWSER',
  SENTRY_NODE = 'SENTRY_NODE',
  STD = 'STD',
}

/**
 * @property level - Минимальный уровень логгирования для стрима, если он ниже чем уровень у логгера, то будет использован уровень логгера
 */
export interface StreamOptions {
  level?: Level
  stream: DestinationStream | NodeJS.WritableStream
  type?: StreamTypes
}

export enum NumLevel {
  TRACE = 10,
  DEBUG = 20,
  INFO = 30,
  WARN = 40,
  ERROR = 50,
  FATAL = 60,
}

/**
 * @param dsn - Sentry DSN если не указывать то логи не будут отправляться в Sentry
 * @param isBrowser - Использовать браузерный логер
 * @param isPretty - Выводить логи в красивом формате
 * @param level - Минимальный уровень логирования
 * @param name - Имя логера, рекомендуется использовать уникальное для каждого модуля
 * @param options - Дополнительные опции для pino
 * @param streamsOptions - Кастомные стримы для логирования
 */
export interface LoggerConfig {
  dsn?: string | undefined
  isBrowser: boolean
  isPretty: boolean
  level: Level
  name: string
  options?: Omit<LoggerOptions, 'level' | 'name'>
  streamsOptions?: Omit<StreamOptions, 'type'>[]
}
