import { signUserInReturnSchema, signUserUpReturnSchema } from '@repo/shared/authentication/schemas'
import { SignUserIn, SignUserUp } from '@repo/shared/authentication/types'
import { createBookReturnSchema } from '@repo/shared/book/schemas'
import { CreateBook } from '@repo/shared/book/types'
import { getUserReturnSchema, updateUserReturnSchema } from '@repo/shared/user/schemas'
import { UpdateUser } from '@repo/shared/user/types'
import { z } from 'zod'
import { METHOD_ENDPOINTS_TO_AUTHORIZATION } from '../constants/api'

export type Method = 'get' | 'post' | 'put'

type GetEndpoint = '/user'
type PostEndpoint = '/authentication/sign-in' | '/authentication/sign-up' | '/book'
type PutEndpoint = '/user'

export type MethodEndpoint<T extends Method> =
  T extends 'get' ? GetEndpoint
  : T extends 'post' ? PostEndpoint
  : T extends 'put' ? PutEndpoint
  : never

type PostEndpointBody<T extends PostEndpoint> =
  T extends '/authentication/sign-in' ? SignUserIn
  : T extends '/authentication/sign-up' ? SignUserUp
  : T extends '/book' ? CreateBook
  : never

type PutEndpointBody<T extends PutEndpoint> = T extends '/user' ? UpdateUser : never

type MethodEndpointBody<T extends Method, E extends MethodEndpoint<T>> =
  T extends 'post' ?
    E extends PostEndpoint ?
      PostEndpointBody<E>
    : never
  : T extends 'put' ?
    E extends PutEndpoint ?
      PutEndpointBody<E>
    : never
  : never

type GetEndpointReturnSchema<T extends GetEndpoint> = T extends '/user' ? typeof getUserReturnSchema : never

type PostEndpointReturnSchema<T extends PostEndpoint> =
  T extends '/authentication/sign-in' ? typeof signUserInReturnSchema
  : T extends '/authentication/sign-up' ? typeof signUserUpReturnSchema
  : T extends '/book' ? typeof createBookReturnSchema
  : never

type PutEndpointReturnSchema<T extends PutEndpoint> = T extends '/user' ? typeof updateUserReturnSchema : never

export type MethodEndpointReturn<T extends Method, E extends MethodEndpoint<T>> =
  T extends 'get' ?
    E extends GetEndpoint ?
      GetEndpointReturnSchema<E>
    : never
  : T extends 'post' ?
    E extends PostEndpoint ?
      PostEndpointReturnSchema<E>
    : never
  : T extends 'put' ?
    E extends PutEndpoint ?
      PutEndpointReturnSchema<E>
    : never
  : never

type QueryBodyParameter<T extends Method> =
  MethodEndpointBody<T, MethodEndpoint<T>> extends never ? object
  : {
      body: MethodEndpointBody<T, MethodEndpoint<T>>
    }

type QueryAuthorizationParameter<T extends Method> =
  (typeof METHOD_ENDPOINTS_TO_AUTHORIZATION)[T][MethodEndpoint<T>] extends false ? object
  : {
      authorization: string
    }

type QueryReturnedData<T extends Method> = MethodEndpointReturn<T, MethodEndpoint<T>> extends never ? never : MethodEndpointReturn<T, MethodEndpoint<T>>

export type InternalQueryParameters<T extends Method> = {
  method: T
  endpoint: MethodEndpoint<T>
} & QueryBodyParameter<T> &
  QueryAuthorizationParameter<T>

export type QueryParameters<T extends Method> = Omit<InternalQueryParameters<T>, 'method'>
export type QueryOptionsParameter = Omit<RequestInit, 'method' | 'bodys'>

export type QueryReturn<T extends Method> =
  | {
      message: 'invalid response data' | 'failed to complete request'
    }
  | {
      message: 'fetched with success'
      data: QueryReturnedData<T> extends never ? unknown : z.infer<QueryReturnedData<T>>
    }
