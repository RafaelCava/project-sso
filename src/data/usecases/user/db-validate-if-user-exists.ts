import { type FindOneUserRepository } from '@/data/protocols'
import { type ValidateIfUserExists } from '@/domain/usecases'

export class DbValidateIfUserExists implements ValidateIfUserExists {
  constructor (private readonly findOneUserRepository: FindOneUserRepository) {}
  async validate (data: ValidateIfUserExists.Params): Promise<boolean> {
    const hasUser = await this.findOneUserRepository.findOne(data, { id: 1 })
    return !!hasUser
  }
}
