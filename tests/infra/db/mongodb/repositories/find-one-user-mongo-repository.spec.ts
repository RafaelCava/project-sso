import { FindOneUserMongoRepository } from '@/infra/db/mongodb/repositories'
import { faker } from '@faker-js/faker'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { type Model } from 'mongoose'
import { type User } from '@/domain/models'
import { UserSchema } from '@/infra/db/mongodb/schemas'
import Mockdate from 'mockdate'

const makeSut = (): FindOneUserMongoRepository => {
  return new FindOneUserMongoRepository()
}
describe('FindOneUserMongoRepository', () => {
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

  it('should be defined', () => {
    const sut = makeSut()
    expect(sut).toBeDefined()
  })

  it('should return null if findOne returns null', async () => {
    const sut = makeSut()
    const result = await sut.findOne({ email: faker.internet.email() }, { id: 1 })
    expect(result).toBeNull()
  })
})
