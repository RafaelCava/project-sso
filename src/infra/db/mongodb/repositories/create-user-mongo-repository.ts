import { type CreateUserRepository } from '@/data/protocols'
import { MongoHelper } from '../helpers/mongo-helper'
import { UserSchema } from '../schemas'
export class CreateUserMongoRepository implements CreateUserRepository {
  async create (data: CreateUserRepository.Params): Promise<CreateUserRepository.Result> {
    return MongoHelper.map<CreateUserRepository.Result>(
      (
        await (
          await MongoHelper.getModel('users', UserSchema)
        ).create(data)
      )._doc
    )
  }
}
