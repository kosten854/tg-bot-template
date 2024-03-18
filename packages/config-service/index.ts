import {
  type Level,
  Logger,
  type LoggerConfig,
} from '@application/logger'

import {
  type FastifyListenOptions,
} from 'fastify'

export abstract class BaseConfigService {
  protected logger: Logger

  protected readonly config = new Map<string, string | undefined>()

  protected trueValues = new Set(['true', '1', 'yes', 'on', 'enabled', 'enable', 'active', 'activated'])

  protected readonly envPrefix: string

  constructor() {
    const envPrefix = process.env['ENV_PREFIX']
    if (!envPrefix) {
      throw new Error('ENV_PREFIX is required')
    }
    this.envPrefix = envPrefix
    process.env[`${envPrefix}_NODE_ENV`] = process.env['NODE_ENV'] ?? 'development'
    Object.keys(process.env).forEach((key) => {
      const value = process.env[key]?.trim()
      if (value) {
        this.config.set(key, value)
      }
    })
    this.logger = new Logger(this.getLoggerOptions('ConfigService'))
  }

  public get debugMode(): boolean {
    return this.getBoolean('DEBUG_MODE')
  }

  public get nodeEnv(): string {
    return this.get('NODE_ENV')!
  }

  public get port(): number {
    return this.getRequiredNumber('PORT')
  }

  public get host(): string {
    return this.getRequired('HOST')
  }

  public get enabledMetricsServer(): boolean {
    return Boolean(this.getNumber('METRICS_PORT') && this.get('METRICS_HOST'))
  }

  public get metricsListenOptions(): FastifyListenOptions {
    return {
      port: this.getNumber('METRICS_PORT')!,
      host: this.get('METRICS_HOST')!,
    }
  }

  public get metricsPath(): string {
    return this.get('METRICS_PATH') ?? '/metrics'
  }

  public getLoggerOptions(name: string): LoggerConfig {
    return {
      level: this.logLevel,
      options: {
        timestamp: true,
      },
      name,
      isBrowser: false,
      isPretty: this.getBoolean('LOG_PRETTY'),
      dsn: this.get('LOG_SENTRY_DSN'),
    }
  }

  public get metricsContentType(): 'openmetrics' | 'prometheus' {
    const contentType = this.get('SSR_METRICS_CONTENT_TYPE')
    switch (contentType) {
      case 'prometheus': {
        return 'prometheus'
      }
      default: {
        return 'openmetrics'
      }
    }
  }

  protected get logLevel(): Level {
    return (this.get('LOG_LEVEL') ?? (this.debugMode ? 'debug' : 'warn')) as Level
  }

  protected get(key: string): string | undefined {
    return this.config.get(`${this.envPrefix}${key}`)
  }

  protected getRequired(key: string): string {
    const value = this.get(key)
    if (!value) {
      throw new Error(`Config key ${key} is required`)
    }
    return value
  }

  protected getNumber(key: string): number | undefined {
    const value = this.get(key)
    const parsed = value === undefined ? Number.NaN : Number.parseFloat(value)
    if (Number.isNaN(parsed)) {
      return undefined
    }
    return parsed
  }

  protected getRequiredNumber(key: string): number {
    const value = this.getNumber(key)
    if (value === undefined) {
      throw new Error(`Config key ${key} is required`)
    }
    return value
  }

  protected getBoolean(key: string): boolean {
    const value = this.get(key)?.toLowerCase()
    return value === undefined ? false : this.trueValues.has(value)
  }

  protected getJson<T>(key: string): T | undefined {
    const value = this.get(key)
    if (value === undefined) {
      return value
    }
    try {
      return JSON.parse(value) as T
    } catch {
      throw new Error(`Config key ${key} is invalid JSON`)
    }
  }

  protected getRequiredJson<T>(key: string): T {
    const value = this.getJson<T>(key)
    if (value === undefined) {
      throw new Error(`Config key ${key} is required`)
    }
    return value
  }
}
