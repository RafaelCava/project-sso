import { type FindOneUserRepository } from '@/data/protocols'
import { UserSchema } from '../schemas'
import { MongoHelper } from '../helpers/mongo-helper'

export class FindOneUserMongoRepository implements FindOneUserRepository {
  async findOne (query: FindOneUserRepository.Query, projection?: FindOneUserRepository.Projection): FindOneUserRepository.Result {
    const params = [query]
    if (projection) {
      const projectionKeys = Object.keys(projection)
      for (const key of projectionKeys) {
        if (projection[key]) {
          projection[key] = 1
        }
      }
      params.push(projection)
    }
    const userModel = await MongoHelper.getModel('users', UserSchema)
    return await userModel.findOne(...params)
  }
}
