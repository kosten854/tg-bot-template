/* eslint-disable @typescript-eslint/no-extraneous-class */
export class UtilService {
  public static deepClone = <T>(data: T): T => JSON.parse(JSON.stringify(data))
}
