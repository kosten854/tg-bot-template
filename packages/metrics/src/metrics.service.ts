import {
  type MetricsOptions,
} from './types.js'
import client, {
  type Metric,
  Registry,
  type RegistryContentType,
} from 'prom-client'

export class MetricsService {
  readonly #registry: Registry<RegistryContentType>

  constructor(options: MetricsOptions) {
    this.#registry = new Registry()
    this.registry.setContentType(options.contentType)

    if (options.doCollectDefaultMetrics) {
      client.collectDefaultMetrics({register: this.#registry})
    }
  }

  public get registry(): client.Registry<RegistryContentType> {
    return this.#registry
  }

  public get contentType(): RegistryContentType {
    return this.#registry.contentType
  }

  public async getMetrics(): Promise<string> {
    return this.#registry.metrics()
  }

  public createMetric(type: 'counter', name: string, help: string): client.Counter<string>
  public createMetric(type: 'gauge', name: string, help: string): client.Gauge<string>
  public createMetric(type: 'summary', name: string, help: string): client.Summary<string>
  public createMetric(type: 'histogram', name: string, help: string): client.Histogram<string>
  public createMetric(type: 'counter' | 'gauge' | 'histogram' | 'summary', name: string, help: string): Metric<string> {
    switch (type) {
      case 'counter': {
        const metric = new client.Counter({
          name: `${name}_counter`,
          help,
        })
        this.registerMetric(metric)
        return metric
      }
      case 'gauge': {
        const metric = new client.Gauge({
          name: `${name}_gauge`,
          help,
        })
        this.registerMetric(metric)
        return metric}
      case 'summary': {
        const metric = new client.Summary({
          name: `${name}_summary`,
          help,
        })
        this.registerMetric(metric)
        return metric}
      case 'histogram': {
        const metric = new client.Histogram({
          name: `${name}_histogram`,
          help,
        })
        this.registerMetric(metric)
        return metric}
      default: {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        throw new Error(`unknown metric type: ${type ?? 'UNKNOWN'}`)
      }
    }
  }

  private registerMetric(metric: Metric<string>): void {
    this.#registry.registerMetric(metric)
  }
}
