export interface Controller<B = any, R = any> {
  handle: (data: B) => Promise<R>
}
