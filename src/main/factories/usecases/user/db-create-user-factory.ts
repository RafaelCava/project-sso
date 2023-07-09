import { DbCreateUser } from '@/data/usecases'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { CreateUserMongoRepository } from '@/infra/db/mongodb/repositories'

export const makeDbCreateUser = (): DbCreateUser => {
  const salt = 12
  return new DbCreateUser(new BcryptAdapter(salt), new CreateUserMongoRepository())
}
