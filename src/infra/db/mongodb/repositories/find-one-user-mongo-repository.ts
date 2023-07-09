import { type FindOneUserRepository } from '@/data/protocols'

export class FindOneUserMongoRepository implements FindOneUserRepository {
  async findOne (query: FindOneUserRepository.Query, projection: FindOneUserRepository.Projection): FindOneUserRepository.Result {
    return Promise.resolve(null)
  }
}
