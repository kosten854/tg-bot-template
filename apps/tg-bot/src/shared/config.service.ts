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
  type BotConfig,
  type Context as BotContext,
} from 'grammy'
import {
  decorate,
  injectable,
} from 'inversify'
import {
  type ConnectionOptions,
} from 'nats'
import {
  type Server,
} from 'node:http'

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

  public get natsOptions(): ConnectionOptions {
    return {
      servers: this.getRequired('NATS_SERVER'),
      debug: this.getBoolean('NATS_DEBUG'),
      reconnect: true,
      waitOnFirstConnect: true,
    }
  }

  public get telegramBotToken(): string {
    return this.getRequired('TELEGRAM_BOT_TOKEN')
  }

  public get telegramBotOptions(): BotConfig<BotContext> {
    return {}
  }

  public get telegramWebhookSecret(): string | undefined {
    return this.get('TELEGRAM_WEBHOOK_SECRET')
  }

  public get telegramWebhookUrl(): string | undefined {
    return this.get('TELEGRAM_WEBHOOK_URL')
  }
}
