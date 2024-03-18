export class ExtendedError extends Error {
  constructor(info: {message: string; stack?: string}) {
    super(info.message)
    this.name = 'Error'
    if (info.stack) {
      this.stack = info.stack
    }
  }
}
