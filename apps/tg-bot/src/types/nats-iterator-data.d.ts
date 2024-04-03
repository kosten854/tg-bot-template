export interface NatsIteratorData {
  value: {
    _msg: {
      subject: Uint8Array
    }
    _rdata: Uint8Array
  }
}
