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

  it('should return user if findOne returns user with only data requested on projection', async () => {
    const sut = makeSut()
    const user = await userModel.create({
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      avatar: faker.internet.avatar()
    })
    const result = await sut.findOne({ email: user.email }, { id: 1 })
    expect(result).toMatchObject({
      id: user.id
    })
  })

  it('should return user if findOne returns user with all data if no projection are provided', async () => {
    const sut = makeSut()
    const user = await userModel.create({
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      avatar: faker.internet.avatar()
    })
    const result = await sut.findOne({ email: user.email })
    expect(result).toMatchObject({
      id: user.id,
      email: user.email,
      name: user.name,
      password: user.password,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    })
  })
})
