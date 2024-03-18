import {
  type StreamOptions,
  StreamTypes,
} from './types.js'
import {
  type Level,
} from 'pino'
import {
  build as PinoPretty,
  type PrettyOptions,
} from 'pino-pretty'

export const createPrettyStream = (level: Level, options: PrettyOptions = {}): StreamOptions => ({
  level,
  type: StreamTypes.PRETTY,
  stream: PinoPretty({
    colorize: true,
    timestampKey: 'time', // --timestampKey
    translateTime: 'yyyy-mm-dd HH:MM:ss.l', // --translateTime
    include: 'level,name,time,msg,err', // --include
    ...options,
  }),
})
