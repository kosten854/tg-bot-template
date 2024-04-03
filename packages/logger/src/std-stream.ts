import {
  type StreamOptions,
  StreamTypes,
} from './types.ts'
import {
  type Level,
  type LogDescriptor,
} from 'pino'

export const createStdStream = (level: Level): StreamOptions => ({
  level,
  type: StreamTypes.STD,
  stream: {
    write: (record: string): void => {
      try {
        const {level} = JSON.parse(record) as LogDescriptor
        if (level < 50) {
          process.stdout.write(record)
        } else {
          process.stderr.write(record)
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
