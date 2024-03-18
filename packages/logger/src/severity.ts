import {
  type SeverityLevel,
} from '@sentry/node'
import {
  NumLevel,
} from './types.js'

const severityMap = new Map<NumLevel, SeverityLevel>([
  [NumLevel.TRACE, 'debug'],
  [NumLevel.DEBUG, 'debug'],
  [NumLevel.INFO, 'info'],
  [NumLevel.WARN, 'warning'],
  [NumLevel.ERROR, 'error'],
  [NumLevel.FATAL, 'fatal'],
])
export const convertPinoLevelToSentrySeverityLevel = (level: number): SeverityLevel => severityMap.get(level) ?? 'error'
