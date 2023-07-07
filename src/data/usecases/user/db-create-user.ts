import { type User } from '@/domain/models'
import { type CreateUser } from '@/domain/usecases'

export class DbCreateUser implements CreateUser {
  async create (data: CreateUser.Params): Promise<User> {
    return Promise.resolve(null)
  }
}
