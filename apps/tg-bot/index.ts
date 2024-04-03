import 'reflect-metadata'
import {
  Logger,
} from '@application/logger'
import {
  MetricsServer,
  MetricsService,
  openMetricsContentType,
  prometheusContentType,
} from '@application/metrics'
import {
  Bot as TelegramBot,
} from 'grammy'
import {
  Container,
  ContainerModule,
  type interfaces,
} from 'inversify'
import {
  type NatsConnection,
  connect as natsConnect,
} from 'nats'
import {
  InversifyTypes,
} from '@/constants/inversify-types.ts'
import {
  HealthCheckModule,
} from '@/modules/health-check/health-check.module.ts'
import {
  NatsModule,
} from '@/modules/nats/nats.module.ts'
import {
  NatsService,
} from '@/modules/nats/nats.service.ts'
import {TelegramModule} from '@/modules/telegram/telegram.module.ts'
import {TelegramUpdate} from '@/modules/telegram/telegram.update.ts'
import {
  TgBotHttpServer,
} from '@/server.ts'
import {
  ConfigService,
} from '@/shared/config.service.ts'

/** @see https://stackoverflow.com/questions/51995925/node-fetch-request-fails-on-server-unable-to-get-local-issuer-certificate */
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

const appBinding = new ContainerModule((bind) => {
  bind<ConfigService>(ConfigService).to(ConfigService).inSingletonScope()
  bind<TgBotHttpServer>(TgBotHttpServer).to(TgBotHttpServer).inSingletonScope()
})

const bootstrap = async (): Promise<void> => {
  const appContainer = new Container()
  appContainer.load(
    appBinding,
    HealthCheckModule,
    NatsModule,
    TelegramModule,
  )

  const configService = appContainer.get<ConfigService>(ConfigService)

  const metricsService = new MetricsService({
    contentType: configService.metricsContentType === 'prometheus' ? prometheusContentType : openMetricsContentType,
    doCollectDefaultMetrics: true,
  })
  appContainer
    .bind<MetricsService>(InversifyTypes.METRICS_SERVICE)
    .toConstantValue(metricsService)

  appContainer
    .bind<Logger>(InversifyTypes.APP_LOGGER)
    .toDynamicValue((context: interfaces.Context) => new Logger(
      configService.getLoggerOptions(
        context
          .currentRequest
          .target
          .metadata
          .find((it) => it.key === 'name')
          ?.value as string,
      ),
    ))

  const logger = appContainer.getTagged<Logger>(InversifyTypes.APP_LOGGER, 'name', 'TgBot')

  // NATS connection
  const nats = await natsConnect(configService.natsOptions)
  appContainer
    .bind<NatsConnection>(InversifyTypes.NATS)
    .toConstantValue(nats)

  // Telegram bot
  const bot = new TelegramBot(configService.telegramBotToken, configService.telegramBotOptions)
  // eslint-disable-next-line @typescript-eslint/naming-convention
  await bot.api.setWebhook(`${configService.telegramWebhookUrl}/telegram/webhook`, {secret_token: configService.telegramWebhookSecret})
  appContainer
    .bind<TelegramBot>(InversifyTypes.TELEGRAM_BOT)
    .toConstantValue(bot)

  logger.info('APPLICATION CONTAINER INITIALIZED')

  const botUpdate = appContainer.get<TelegramUpdate>(TelegramUpdate)
  botUpdate.init()

  const natsService = appContainer.get<NatsService>(NatsService)
  void natsService.runWorker()

  const app = await appContainer.getAsync<TgBotHttpServer>(TgBotHttpServer)

  await app.startServer()

  if (configService.enabledMetricsServer) {
    const metricsServer = new MetricsServer(metricsService, configService.serverOptions)
    await metricsServer.startMetricServer(configService.metricsListenOptions, configService.metricsPath)
  }
}

await bootstrap()
