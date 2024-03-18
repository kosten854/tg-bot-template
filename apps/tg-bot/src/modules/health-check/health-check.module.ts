import {
  HealthCheckController,
} from './health-check.controller.ts'
import {
  ContainerModule,
} from 'inversify'

export const HealthCheckModule = new ContainerModule((bind) => {
  bind<HealthCheckController>(HealthCheckController)
    .to(HealthCheckController)
    .inSingletonScope()
})
