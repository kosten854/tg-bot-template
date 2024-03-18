import {
  type MetricsService,
} from './metrics.service.js'
import {
  type FastifyHttpOptions,
  type FastifyInstance,
  type FastifyListenOptions,
  fastify,
} from 'fastify'
import {type Server} from 'node:http'

export class MetricsServer {
  readonly #server: FastifyInstance

  constructor(private readonly metricsService: MetricsService, options: FastifyHttpOptions<Server>) {
    this.#server = fastify(options)
  }

  public async startMetricServer(listenOptions: FastifyListenOptions, path: string): Promise<string> {
    if (!this.#server) {
      throw new Error('server already started')
    }
    this.#server
      .get(path, async (request, reply) => {
        return reply
          .type(this.metricsService.contentType)
          .status(200)
          .send(await this.metricsService.getMetrics())
      })
      .get(`${path}.json`, async (request, reply) => {
        return reply
          .type('application/json')
          .status(200)
          .send(await this.metricsService.registry.getMetricsAsJSON())
      })
    return this.#server.listen(listenOptions)
  }
}
