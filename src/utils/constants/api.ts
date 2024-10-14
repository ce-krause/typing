import { signUserInReturnSchema, signUserUpReturnSchema } from '@repo/shared/authentication/schemas'
import { createBookReturnSchema } from '@repo/shared/book/schemas'
import { getUserReturnSchema, updateUserReturnSchema } from '@repo/shared/user/schemas'
import { Method, MethodEndpoint, MethodEndpointReturn } from '../types/api'

export const METHOD_ENDPOINTS_TO_SCHEMA: {
  [method in Method]: {
    [endpoint in MethodEndpoint<method>]: MethodEndpointReturn<method, endpoint>
  }
} = {
  get: {
    '/user': getUserReturnSchema
  },
  post: {
    '/authentication/sign-in': signUserInReturnSchema,
    '/authentication/sign-up': signUserUpReturnSchema,
    '/book': createBookReturnSchema
  },
  put: {
    '/user': updateUserReturnSchema
  }
} as const

export const METHOD_ENDPOINTS_TO_AUTHORIZATION: {
  [method in Method]: {
    [endpoint in MethodEndpoint<method>]: boolean
  }
} = {
  get: {
    '/user': true
  },
  post: {
    '/authentication/sign-in': false,
    '/authentication/sign-up': false,
    '/book': true
  },
  put: {
    '/user': true
  }
}
