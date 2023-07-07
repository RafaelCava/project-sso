import { type CreateUserRepository } from '@/data/protocols'
import { type CreateUser } from '@/domain/usecases'

export class DbCreateUser implements CreateUser {
  constructor (private readonly createUserRepository: CreateUserRepository) {}
  async create (data: CreateUser.Params): Promise<CreateUser.Result> {
    await this.createUserRepository.create(data)
    return null
  }
}
