import {
  TelegramController,
} from './telegram.controller.ts'
import {
  TelegramUpdate,
} from './telegram.update.ts'
import {
  ContainerModule,
} from 'inversify'

export const TelegramModule = new ContainerModule((bind) => {
  bind<TelegramController>(TelegramController).toSelf().inSingletonScope()
  bind<TelegramUpdate>(TelegramUpdate).toSelf().inSingletonScope()
})

// TelegramModule.
