import { type ValidateIfUserExists } from '@/domain/usecases'
import { type User } from '@/domain/usecases/models'
import { type Controller } from '@/presentation/protocols'

export class CreateUserController implements Controller<CreateUserController.Params, CreateUserController.Result> {
  constructor (private readonly validateIfUserExists: ValidateIfUserExists) {}
  async handle (data: CreateUserController.Params): Promise<CreateUserController.Result> {
    await this.validateIfUserExists.validate({
      email: data.email
    })
    return null
  }
}

export namespace CreateUserController {
  export type Params = {
    email: string
    name: string
    password: string
    avatar?: string
  }

  export type Result = User
}
