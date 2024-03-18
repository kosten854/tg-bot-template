import {
  NumLevel,
  type StreamOptions,
  StreamTypes,
} from './types.js'
import {
  type Level,
  type LogDescriptor,
} from 'pino'

export const createConsoleStream = (level: Level): StreamOptions => ({
  level,
  type: StreamTypes.CONSOLE,
  stream: {
    write: (record: string): void => {
      try {
        const data = JSON.parse(record) as LogDescriptor
        switch (data['level'] as NumLevel) {
          case NumLevel.TRACE: {
            console.trace(record)
            break
          }
          case NumLevel.DEBUG: {
            console.debug(record)
            break
          }
          case NumLevel.INFO: {
            console.info(record)
            break
          }
          case NumLevel.WARN: {
            console.warn(record)
            break
          }
          case NumLevel.ERROR:
          case NumLevel.FATAL: {
            console.error(record)
            break
          }
          default: {
            console.info(record)
          }
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          error.message = `${record} ${error.message}`
        }
        console.error(error)
      }
    },
  },
})
