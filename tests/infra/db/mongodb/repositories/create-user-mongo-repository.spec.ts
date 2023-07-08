import { CreateUserMongoRepository } from '@/infra/db/mongodb/repositories'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { type Model } from 'mongoose'
import { UserSchema } from '@/infra/db/mongodb/schemas'
import { type User } from '@/domain/models'
import Mockdate from 'mockdate'

const makeSut = (): CreateUserMongoRepository => {
  return new CreateUserMongoRepository()
}

describe('CreateUserMongoRepository', () => {
  let userModel: Model<User>
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    userModel = await MongoHelper.getModel('users', UserSchema)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(() => {
    Mockdate.set(new Date())
  })

  afterEach(async () => {
    await userModel.deleteMany({})
    Mockdate.reset()
  })

  it('should be defined', async () => {
    const sut = makeSut()
    expect(sut).toBeDefined()
  })
})
