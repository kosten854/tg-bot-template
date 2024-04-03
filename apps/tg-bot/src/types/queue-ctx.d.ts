import {
  type Context,
} from 'grammy'

export type SendMessageParameters = Parameters<typeof Context.prototype.api.sendMessage>

export type ContextReplyParameters = Parameters<typeof Context.prototype.reply>

export interface QueueContext extends Context {
  replyQueue: (...args: ContextReplyParameters) => Promise<void> | void
}
