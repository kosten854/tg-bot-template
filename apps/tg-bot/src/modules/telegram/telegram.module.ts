import {
  TelegramController,
} from './telegram.controller.ts'
import {
  ContainerModule,
} from 'inversify'

export const TelegramModule = new ContainerModule((bind) => {
  bind<TelegramController>(TelegramController).toSelf().inSingletonScope()
})
