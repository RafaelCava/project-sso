import { DbValidateIfUserExists } from '@/data/usecases'
import { FindOneUserMongoRepository } from '@/infra/db/mongodb/repositories'

export const makeDbValidateIfUserExists = (): DbValidateIfUserExists => {
  return new DbValidateIfUserExists(new FindOneUserMongoRepository())
}
