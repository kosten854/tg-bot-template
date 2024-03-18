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
  Container,
  ContainerModule,
  type interfaces,
} from 'inversify'
import {
  InversifyTypes,
} from '@/constants/inversify-types.js'
import {
  HealthCheckModule,
} from '@/modules/health-check/health-check.module.ts'
import {
  TgBotHttpServer,
} from '@/server.js'
import {
  ConfigService,
} from '@/shared/config.service.js'

/** @see https://stackoverflow.com/questions/51995925/node-fetch-request-fails-on-server-unable-to-get-local-issuer-certificate */
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

const appBinding = new ContainerModule((bind) => {
  bind<ConfigService>(ConfigService).to(ConfigService).inSingletonScope()
  bind<TgBotHttpServer>(TgBotHttpServer).to(TgBotHttpServer).inSingletonScope()
})

const bootstrap = async (): Promise<void> => {
  const appContainer = new Container()
  appContainer.load(appBinding)

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

  logger.info('APPLICATION STARTED')

  // load modules
  appContainer.load(HealthCheckModule)

  const app = await appContainer.getAsync<TgBotHttpServer>(TgBotHttpServer)
  await app.startServer()

  if (configService.enabledMetricsServer) {
    const metricsServer = new MetricsServer(metricsService, configService.serverOptions)
    await metricsServer.startMetricServer(configService.metricsListenOptions, configService.metricsPath)
  }
}

await bootstrap()
