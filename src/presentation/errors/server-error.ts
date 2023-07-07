export class ServerError extends Error {
  constructor (stack: string) {
    super('Internal error')
    this.name = 'ServerError'
    this.stack = stack
  }
}
