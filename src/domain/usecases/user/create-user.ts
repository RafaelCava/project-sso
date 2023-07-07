import { type User } from '@/domain/models'

export interface CreateUser {
  create: (data: CreateUser.Params) => Promise<CreateUser.Result>
}

export namespace CreateUser {
  export type Params = {
    email: string
    name: string
    password: string
    avatar?: string
  }

  export type Result = User
}
