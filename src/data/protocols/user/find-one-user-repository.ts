import { type User } from '@/domain/models'

export interface FindOneUserRepository {
  findOne: (query: FindOneUserRepository.Query, projection: FindOneUserRepository.Projection) => FindOneUserRepository.Result
}

export namespace FindOneUserRepository {
  export type Query = Partial<User>
  export type Projection = Record<string, 1>
  export type Result = Promise<User | null>
}
