import {
  Logger,
} from '@application/logger'
import {
  type RouteHandlerMethod,
} from 'fastify'
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

@injectable()
export class HealthCheckController {
  constructor(
    @inject(InversifyTypes.APP_LOGGER) @tagged('name', 'HealthCheckController') private readonly logger: Logger,
  ) {}

  @Route('get', '/health-check')
  public getHealthCheck(): RouteHandlerMethod {
    return async (request, reply): Promise<ReturnType<RouteHandlerMethod>> => {
      const result = await new Promise((resolve) => {
        resolve('OK')
      })
      return reply
        .status(200)
        .send(result)
    }
  }
}
