export interface Validation<I = any> {
  validate: (input: I) => Error | null
}
