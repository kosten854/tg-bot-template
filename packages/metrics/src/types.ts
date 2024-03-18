import {
  type RegistryContentType,
} from 'prom-client'

export interface MetricsOptions {
  contentType: RegistryContentType
  doCollectDefaultMetrics: boolean
}

export {
  type Gauge,
  type Counter,
  type Histogram,
  type Summary,
} from 'prom-client'

export {prometheusContentType, openMetricsContentType} from 'prom-client'
