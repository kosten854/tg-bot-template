/* eslint-disable typescript-sort-keys/interface */
import {
  type HTTPMethods,
  type RouteHandlerMethod,
} from 'fastify'

export interface MethodReturnInterface {
  handler: RouteHandlerMethod
  method: HTTPMethods
  url: `/${string}`
}
