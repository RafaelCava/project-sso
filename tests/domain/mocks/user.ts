import { faker } from '@faker-js/faker'
import { type User } from '../models'

export const makeUser = (): User => ({
  email: faker.internet.email(),
  name: faker.person.fullName(),
  password: faker.internet.password(),
  avatar: faker.image.avatar(),
  createdAt: String(faker.date.recent()),
  updatedAt: String(faker.date.recent()),
  id: faker.string.uuid()
})
