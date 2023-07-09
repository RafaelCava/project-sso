import { type HttpResponse } from '@/presentation/protocols/http'

export const badRequest = (error: Error): HttpResponse<Error> => ({
  statusCode: 400,
  body: error
})

export const serverError = (error: Error): HttpResponse<Error> => ({
  statusCode: 500,
  body: error
})

export function ok<T> (body: T): HttpResponse<T> {
  return {
    body,
    statusCode: 200
  }
}

export const conflictError = (error: Error): HttpResponse<Error> => ({
  statusCode: 409,
  body: error
})
