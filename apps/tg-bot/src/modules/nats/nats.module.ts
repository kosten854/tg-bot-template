import {
  NatsService,
} from './nats.service.ts'
import {
  ContainerModule,
} from 'inversify'

export const NatsModule = new ContainerModule((bind) => {
  bind<NatsService>(NatsService).toSelf()
})
