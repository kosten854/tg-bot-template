import {
  Logger,
} from '@application/logger'
import {
  inject,
  injectable,
  tagged,
} from 'inversify'
import {
  type NatsConnection,
} from 'nats'
import {
  InversifyTypes,
} from '@/constants/inversify-types.ts'

@injectable()
export class NatsService {
  constructor(
    @inject(InversifyTypes.APP_LOGGER) @tagged('name', 'NatsService') private readonly logger: Logger,
    @inject(InversifyTypes.NATS) private readonly nats: NatsConnection,
  ) {}
}
