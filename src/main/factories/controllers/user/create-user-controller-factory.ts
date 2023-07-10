import { CreateUserController } from '@/presentation/controllers/user'
import { type Controller } from '@/presentation/protocols'
import { makeCreateUserValidation } from '@/main/factories/validations'
import { makeDbCreateUser, makeDbValidateIfUserExists } from '@/main/factories/usecases'

export const makeCreateUserController = (): Controller<CreateUserController.Params> => {
  return new CreateUserController(makeCreateUserValidation(), makeDbValidateIfUserExists(), makeDbCreateUser())
}
