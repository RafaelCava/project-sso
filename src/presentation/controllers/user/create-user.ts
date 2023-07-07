import { type ValidateIfUserExists } from '@/domain/usecases'
import { type User } from '@/domain/usecases/models'
import { EmailInUseError } from '@/presentation/errors'
import { badRequest, serverError } from '@/presentation/helpers/http-helper'
import { type HttpResponse, type Controller, type Validation } from '@/presentation/protocols'

export class CreateUserController implements Controller<CreateUserController.Params, CreateUserController.Result> {
  constructor (
    private readonly validation: Validation,
    private readonly validateIfUserExists: ValidateIfUserExists
  ) {}

  async handle (data: CreateUserController.Params): Promise<CreateUserController.Result> {
    try {
      const error = this.validation.validate(data)
      if (error) {
        return badRequest(error)
      }
      const existsUser = await this.validateIfUserExists.validate({
        email: data.email
      })
      if (existsUser) {
        return badRequest(new EmailInUseError())
      }
      return null
    } catch (error) {
      return serverError(error)
    }
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
