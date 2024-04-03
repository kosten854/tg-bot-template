/* eslint-disable @typescript-eslint/naming-convention */
import {
  NatsService,
} from '../nats/nats.service.ts'
import {
  Logger,
} from '@application/logger'
import {
  type Context,
  Bot as TelegramBot,
} from 'grammy'
import {
  inject,
  injectable,
  tagged,
} from 'inversify'
import {
  match,
} from 'ts-pattern'
import {
  InversifyTypes,
} from '@/constants/inversify-types.ts'
import {
  ConfigService,
} from '@/shared/config.service.ts'
import {
  type QueueContext,
} from '@/types/queue-ctx.js'

@injectable()
export class TelegramUpdate {
  constructor(
    @inject(InversifyTypes.APP_LOGGER) @tagged('name', 'TelegramController') private readonly logger: Logger,
    @inject(InversifyTypes.TELEGRAM_BOT) private readonly bot: TelegramBot,
    @inject(ConfigService) private readonly configService: ConfigService,
    @inject(NatsService) private readonly natsService: NatsService,
  ) {}

  public init(): void {
    this.bot.hears(/^(?!\/).*/gui, (ctx: Context) => {
      (ctx as unknown as QueueContext).replyQueue = async (...args: Parameters<typeof ctx.reply>): Promise<void> => {
        if (ctx.message) {
          await this.natsService.addTgMessageToQueue(0, {
            type: 'send_message',
            args: [
              ctx.from!.id.toString(),
              ...args,
            ],
          })
        }
      }
      return this.messageHandler(ctx as unknown as QueueContext)
    })
  }

  public async messageHandler(ctx: QueueContext): Promise<void> {
    if (!ctx.message) {
      return
    }
    await match(ctx.message.text?.toLowerCase())
      .with('hello', 'привет', 'hi', 'здравствуйте', async () => {
        await ctx.replyQueue('*Hello*, world!', {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                {text: 'Click me', url: 'https://ya.ru'},
              ],
            ],
          },
        })
      })
      .otherwise(async () => {
        await ctx.replyQueue('I do not understand you. Try again.')
      })
  }
}
