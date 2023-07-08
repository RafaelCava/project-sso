import { type CreateUserRepository } from '@/data/protocols'

export class CreateUserMongoRepository implements CreateUserRepository {
  async create (data: CreateUserRepository.Params): Promise<CreateUserRepository.Result> {
    return null
  }
}
