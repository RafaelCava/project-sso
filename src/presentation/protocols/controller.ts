import { type HttpResponse } from './http'

export interface Controller<B, R = HttpResponse> {
  handle: (data: B) => Promise<R>
}
