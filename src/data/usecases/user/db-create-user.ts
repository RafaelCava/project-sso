import { type Hasher, type CreateUserRepository } from '@/data/protocols'
import { type CreateUser } from '@/domain/usecases'

export class DbCreateUser implements CreateUser {
  constructor (private readonly hasher: Hasher, private readonly createUserRepository: CreateUserRepository) {}
  async create (data: CreateUser.Params): Promise<CreateUser.Result> {
    const hash = await this.hasher.hash(data.password)
    const user = await this.createUserRepository.create({
      ...data,
      password: hash
    })
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }
}
