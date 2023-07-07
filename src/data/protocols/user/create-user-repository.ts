import { type User } from '@/domain/models'

export interface CreateUserRepository {
  create: (data: CreateUserRepository.Params) => Promise<CreateUserRepository.Result>
}

export namespace CreateUserRepository {
  export type Params = {
    email: string
    name: string
    password: string
    avatar?: string
  }
  export type Result = User | null
}
