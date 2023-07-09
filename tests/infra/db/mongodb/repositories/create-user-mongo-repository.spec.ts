import { CreateUserMongoRepository } from '@/infra/db/mongodb/repositories'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { type Model } from 'mongoose'
import { UserSchema } from '@/infra/db/mongodb/schemas'
import { type User } from '@/domain/models'
import Mockdate from 'mockdate'
import { faker } from '@faker-js/faker'

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

  it('should call create with correct values', async () => {
    const sut = makeSut()
    const createSpy = jest.spyOn(userModel, 'create')
    const request = {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      avatar: faker.internet.avatar()
    }
    await sut.create(request)
    expect(createSpy).toHaveBeenCalledTimes(1)
    expect(createSpy).toHaveBeenCalledWith(request)
  })
})
