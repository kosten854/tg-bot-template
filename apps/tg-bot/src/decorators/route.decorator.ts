/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-restricted-syntax */
import {
  type HTTPMethods,
} from 'fastify'
import {type MethodReturnInterface} from '@/types/controller.ts'

export function Route(method: HTTPMethods, url: `/${string}`): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata('url', url, descriptor.value)
    Reflect.defineMetadata('method', method, descriptor.value)
    return descriptor
  }
}

export function getAllRoutes(instance: any): MethodReturnInterface[] {
  const prototype = Object.getPrototypeOf(instance)
  const methods = Object.getOwnPropertyNames(prototype)
  const getMethods: MethodReturnInterface[] = []

  methods.forEach((methodName) => {
    const method = prototype[methodName]
    const httpMethod = Reflect.getMetadata('method', method)
    const url = Reflect.getMetadata('url', method)
    if (httpMethod && url) {
      getMethods.push({handler: instance[methodName](), url, method: httpMethod.toLowerCase()})
    }
  })
  return getMethods
}
