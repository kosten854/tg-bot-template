/* eslint-disable no-continue */
import {
  getAllRoutes,
} from './decorators/route.decorator.ts'
import {
  HealthCheckController,
} from './modules/health-check/health-check.controller.ts'
import {
  TelegramController,
} from './modules/telegram/telegram.controller.ts'
import {
  type MethodReturnInterface,
} from './types/controller.ts'
import {
  Logger,
} from '@application/logger'
import {
  type FastifyInstance,
  fastify,
} from 'fastify'
import {
  inject,
  injectable,
  postConstruct,
  tagged,
} from 'inversify'
import {
  InversifyTypes,
} from '@/constants/inversify-types.ts'
import {
  ConfigService,
} from '@/shared/config.service.ts'

@injectable()
export class TgBotHttpServer {
  private readonly server: FastifyInstance

  constructor(
    @inject(ConfigService) private readonly configService: ConfigService,
    @inject(HealthCheckController) private readonly healthCheckController: HealthCheckController,
    @inject(TelegramController) private readonly telegramController: TelegramController,
    @inject(InversifyTypes.APP_LOGGER) @tagged('name', 'TgBotHttpServer') private readonly logger: Logger,
  ) {
    this.server = this.createServer()
  }

  public createServer(): FastifyInstance {
    return fastify(this.configService.serverOptions)
  }

  public async startServer(): Promise<void> {
    try {
      const server = await this.server.listen(this.configService.listenOptions)
      this.logger.info('HTTP SERVER STARTED %s', server)
    } catch (error: unknown) {
      this.logger.error(error as Error, 'HTTP SERVER START FAILED')
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit(1)
    }
  }

  @postConstruct()
  public createRequestHandler(): void {
    const routes: MethodReturnInterface[] = []
    routes.push(
      ...getAllRoutes(this.healthCheckController),
      ...getAllRoutes(this.telegramController),
    )
    // подтянуть остальные контроллеры
    for (const route of routes) {
      this.server.route(route)
    }
  }
}
