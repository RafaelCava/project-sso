import { CreateUserController } from '@/presentation/controllers/user'
import { type Controller } from '@/presentation/protocols'
import { makeCreateUserValidation } from '../../validations'
import { makeDbCreateUser } from '../../usecases'

export const makeCreateUserController = (): Controller<CreateUserController.Params> => {
  return new CreateUserController(makeCreateUserValidation(), makeValidateIfUserExists(), makeDbCreateUser())
}
