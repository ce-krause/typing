import { METHOD_ENDPOINTS_TO_SCHEMA } from '../constants/api'
import { InternalQueryParameters, Method, QueryOptionsParameter, QueryParameters, QueryReturn } from '../types/api'

const internal = async <T extends Method>(parameters: InternalQueryParameters<T>, options?: QueryOptionsParameter): Promise<QueryReturn<T>> => {
  try {
    const response = await fetch(new URL(parameters.endpoint, process.env.API_URL), {
      ...options,
      method: parameters.method,
      body: 'body' in parameters ? JSON.stringify(parameters.body) : undefined,
      headers: {
        ...options?.headers,
        authorization: 'authorization' in parameters ? `Bearer ${Buffer.from(parameters.authorization).toString('base64')}` : ''
      }
    })

    const data = await response.json()
    const schema = METHOD_ENDPOINTS_TO_SCHEMA[parameters.method][parameters.endpoint]

    const parsed = schema.safeParse(data)

    if (!parsed.success) {
      return {
        message: 'invalid response data'
      }
    }

    return {
      message: 'fetched with success',
      data
    }
  } catch {
    return {
      message: 'failed to complete request'
    }
  }
}

export const query: {
  [method in Method]: (parameters: QueryParameters<method>, options?: QueryOptionsParameter) => Promise<QueryReturn<method>>
} = {
  get: async (parameters: QueryParameters<'get'>, options?: QueryOptionsParameter) => {
    const response = await internal(
      {
        ...parameters,
        method: 'get'
      },
      options
    )

    return response
  },
  post: async (parameters: QueryParameters<'post'>, options?: QueryOptionsParameter) => {
    const response = await internal(
      {
        ...parameters,
        method: 'post'
      },
      options
    )

    return response
  },
  put: async (parameters: Omit<QueryParameters<'put'>, 'method'>, options?: QueryOptionsParameter) => {
    const response = await internal(
      {
        ...parameters,
        method: 'put'
      },
      options
    )

    return response
  }
}
