import { type ValidateIfUserExists } from '@/domain/usecases'
import { type User } from '@/domain/usecases/models'
import { MissingParamError } from '@/presentation/errors'
import { badRequest } from '@/presentation/helpers/http-helper'
import { type HttpResponse, type Controller } from '@/presentation/protocols'

export class CreateUserController implements Controller<CreateUserController.Params, CreateUserController.Result> {
  constructor (private readonly validateIfUserExists: ValidateIfUserExists) {}
  async handle (data: CreateUserController.Params): Promise<CreateUserController.Result> {
    for (const field of ['email', 'name', 'password']) {
      if (!data[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
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

  export type Result = HttpResponse<User | Error>
}
