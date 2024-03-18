import {
  BaseConfigService,
} from '@application/config-service'
import {
  Logger,
} from '@application/logger'
import {
  type FastifyHttpOptions,
  type FastifyListenOptions,
} from 'fastify'
import {
  decorate,
  injectable,
} from 'inversify'
import {type Server} from 'node:http'

decorate(injectable(), BaseConfigService)
@injectable()
export class ConfigService extends BaseConfigService {
  constructor() {
    super()
    this.logger.info('ConfigService instance created')
  }

  public get listenOptions(): FastifyListenOptions {
    return {
      port: this.port,
      host: this.host,
    }
  }

  public get serverOptions(): FastifyHttpOptions<Server> {
    return {
      logger: this.getBoolean('LOG_HTTP_ENABLED')
        ? new Logger(this.getLoggerOptions('Server instance'))
        : false,
      connectionTimeout: 120_000,
      requestTimeout: 120_000,
    }
  }
}
