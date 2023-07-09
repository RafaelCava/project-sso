import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { UserSchema } from '@/infra/db/mongodb/schemas'
import { faker } from '@faker-js/faker'

const makeDocument = (): any => ({
  _id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  __v: 0
})

describe('Mongo Helper', () => {
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('should reconnect if mongodb is down', async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    let userModel = await MongoHelper.getModel('users', UserSchema)
    expect(userModel).toBeTruthy()
    let isConnected = MongoHelper.isConnected()
    expect(isConnected).toBe(true)
    await MongoHelper.disconnect()
    userModel = await MongoHelper.getModel('users', UserSchema)
    isConnected = MongoHelper.isConnected()
    expect(isConnected).toBe(true)
    expect(userModel).toBeTruthy()
  })

  it('should return true if mongodb is connected', async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    const isConnected = MongoHelper.isConnected()
    expect(isConnected).toBe(true)
  })

  it('should return false if mongodb is connected', async () => {
    await MongoHelper.disconnect()
    const isConnected = MongoHelper.isConnected()
    expect(isConnected).toBe(false)
  })

  it('should return formated document on success', () => {
    const fakeDocument = makeDocument()
    const formated = MongoHelper.map(fakeDocument)
    expect(formated).toEqual({
      id: fakeDocument._id,
      name: fakeDocument.name,
      email: fakeDocument.email
    })
  })

  it('should return formated documents on success', () => {
    const fakeDocuments = [makeDocument(), makeDocument()]
    const formated = MongoHelper.map(fakeDocuments)
    expect(formated).toEqual([{
      id: fakeDocuments[0]._id,
      name: fakeDocuments[0].name,
      email: fakeDocuments[0].email
    }, {
      id: fakeDocuments[1]._id,
      name: fakeDocuments[1].name,
      email: fakeDocuments[1].email
    }])
  })
})
