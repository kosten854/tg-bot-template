import {
  Logger,
} from '@application/logger'
import {
  type RouteHandlerMethod,
} from 'fastify'
import {
  Bot as TelegramBot, webhookCallback,
} from 'grammy'
import {
  inject,
  injectable,
  tagged,
} from 'inversify'
import {
  InversifyTypes,
} from '@/constants/inversify-types.ts'
import {
  Route,
} from '@/decorators/route.decorator.ts'
import {ConfigService} from '@/shared/config.service.ts'

@injectable()
export class TelegramController {
  constructor(
    @inject(InversifyTypes.APP_LOGGER) @tagged('name', 'TelegramController') private readonly logger: Logger,
    @inject(InversifyTypes.TELEGRAM_BOT) private readonly bot: TelegramBot,
    @inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  @Route('post', '/telegram/webhook')
  public telegramWebhook(): RouteHandlerMethod {
    return webhookCallback(this.bot, 'fastify', {secretToken: this.configService.telegramWebhookSecret})
  }
}
