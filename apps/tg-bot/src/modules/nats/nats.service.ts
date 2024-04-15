/* eslint-disable no-underscore-dangle */
import {
  Logger,
} from '@application/logger'
import {
  Bot as TelegramBot,
} from 'grammy'
import {
  inject,
  injectable,
  tagged,
} from 'inversify'
import {
  JSONCodec,
  type JetStreamClient,
  type JetStreamManager,
  type NatsConnection,
} from 'nats'
import {
  setTimeout,
} from 'node:timers/promises'
import {
  InversifyTypes,
} from '@/constants/inversify-types.ts'
import {
  UtilService,
} from '@/shared/util.service.ts'
import {
  type SendMessageParameters,
} from '@/types/queue-ctx.ts'
import {
  type HighPriority,
  type LowPriority,
  type QueuePriority,
} from '@/types/queue-priority.ts'

interface MessageQueue {
  args: SendMessageParameters
  type: 'send_message'
}

@injectable()
export class NatsService {
  private jetStream: JetStreamClient

  private jsonCodec = JSONCodec()

  private jetStreamManager!: JetStreamManager

  constructor(
    @inject(InversifyTypes.APP_LOGGER) @tagged('name', 'NatsService') private readonly logger: Logger,
    @inject(InversifyTypes.NATS) private readonly nats: NatsConnection,
    @inject(InversifyTypes.TELEGRAM_BOT) private readonly bot: TelegramBot,
  ) {
    this.jetStream = this.nats.jetstream()
  }

  public async runWorker(): Promise<void> {
    this.jetStreamManager = await this.nats.jetstreamManager()
    const queueNameHigh: `tg.message.${HighPriority}.chat.*` = 'tg.message.0.chat.*'
    const queueNameLow: `tg.message.${LowPriority}.chat.*` = 'tg.message.1.chat.*'

    // console.log('🚀 ~ NatsService ~ runWorker ~ streams:', streams)
    // streams.forEach((si) => {
    //   console.log(si)
    // })
    const streamHighName: `priority${HighPriority}` = 'priority0'
    const streamLowName: `priority${LowPriority}` = 'priority1'

    await this.jetStreamManager.streams.add({name: streamHighName, subjects: [queueNameHigh]})
    await this.jetStreamManager.streams.add({name: streamLowName, subjects: [queueNameLow]})

    while (true) {
      const messages: MessageQueue[] = []

      const streamHighSeq = await this.jetStreamManager.streams.info(streamHighName)
      if (streamHighSeq.state.messages > 0) {
        messages.push(...await this.getMessagesFromStream(streamHighSeq.state.messages, streamHighName))
      }

      const streamLowSeq = await this.jetStreamManager.streams.info(streamHighName)
      if (streamLowSeq.state.messages > 0) {
        messages.push(...await this.getMessagesFromStream(streamLowSeq.state.messages, streamLowName))
      }

      let chatMessages = messages.reduce<{chatId: string; messages: MessageQueue[]}[]>((acc, message) => {
        const chatId = message.args[0]
        let chatMessages = acc.find((chat) => chat.chatId === chatId.toString())
        if (!chatMessages) {
          chatMessages = {chatId: chatId.toString(), messages: []}
          acc.push(chatMessages)
        }
        chatMessages.messages.push(message)
        return acc
      }, [])

      while (chatMessages.length > 0) {
        const streamHighSeq = await this.jetStreamManager.streams.info(streamHighName)
        if (streamHighSeq.state.messages > 0) {
          const newHighMessage: MessageQueue[] = await this.getMessagesFromStream(streamHighSeq.state.messages, streamHighName)
          chatMessages = newHighMessage.reduce((acc, message) => {
            const chatId = message.args[0]
            let chatMessages = acc.find((chat) => chat.chatId === chatId.toString())
            if (!chatMessages) {
              chatMessages = {chatId: chatId.toString(), messages: []}
              acc.push(chatMessages)
            }
            chatMessages.messages.push(message)
            return acc
          }, UtilService.deepClone(chatMessages))
        }

        const messages = chatMessages.reduce<MessageQueue[]>((acc, chat) => {
          const message = chat.messages.shift()
          if (!message) {
            return acc
          }
          acc.push(message)
          return acc
        }, [])
        for (const message of messages) {
          console.log('🚀 ~ NatsService ~ runWorker ~ message:', message)
          await this.sendToBot(message)
          await setTimeout(40)
        }
        chatMessages = chatMessages.filter((chat) => chat.messages.length > 0)
        await setTimeout(1000)
      }

      await setTimeout(40)
    }
  }

  public async addTgMessageToQueue(priority: QueuePriority, message: MessageQueue): Promise<void> {
    await this.jetStream.publish(`tg.message.${priority}.chat.${message.args[0]}`, this.encode(message))
  }

  public async massMessaging(priority: LowPriority, message: MessageQueue, chatIds: number[]): Promise<void> {
    for (const chatId of chatIds) {
      const userMessage: MessageQueue = {
        type: message.type,
        args: [chatId, ...message.args.slice(1)] as SendMessageParameters,
      }
      await this.addTgMessageToQueue(priority, userMessage)
    }
  }

  private async sendToBot(message: MessageQueue, tryCount = 5, timeout?: number): Promise<void> {
    if (tryCount <= 0) {
      return
    }
    if (timeout) {
      await setTimeout(timeout)
    }
    if (message.type === 'send_message') {
      const result = await this.bot.api.sendMessage(...message.args)
        .catch((error) => {
          return error
        })
      if (result instanceof Error && result.message.includes('429')) {
        this.logger.error(result, result.message)
        await this.sendToBot(message, 4000, tryCount - 1)
      } else if (result instanceof Error) {
        this.logger.error(result, result.message)
      }
    }
  }

  private async getMessagesFromStream(count: number, streamName: string): Promise<MessageQueue[]> {
    const streamSeq = await this.jetStreamManager.streams.info(streamName)
    if (streamSeq.state.messages === 0) {
      return []
    }
    const result: MessageQueue[] = []
    for (let i = 0; i < (streamSeq.state.messages < count ? streamSeq.state.messages : count); i++) {
      const sm = await this.jetStreamManager.streams.getMessage(streamName, {seq: streamSeq.state.first_seq + i}).catch((error) => error)
      if (sm instanceof Error) {
        await this.jetStreamManager.streams.deleteMessage(streamName, streamSeq.state.first_seq + i).catch((error) => error)
        continue
      }
      result.push(this.decode<MessageQueue>(sm.smr.message.data))
      await this.jetStreamManager.streams.deleteMessage(streamName, streamSeq.state.first_seq + i).catch((error) => error)
    }

    return result
  }

  private decode<T extends object>(data: string): T {
    return JSON.parse(Buffer.from(data, 'base64').toString('utf8'))
  }

  private encode<T extends object>(data: T): Uint8Array {
    return this.jsonCodec.encode(data)
  }
}
