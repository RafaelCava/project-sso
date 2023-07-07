import { type CreateUser, type ValidateIfUserExists } from '@/domain/usecases'
import { type User } from '@/domain/models'
import { EmailInUseError, UnexpectedError } from '@/presentation/errors'
import { badRequest, conflictError, ok, serverError } from '@/presentation/helpers/http-helper'
import { type HttpResponse, type Controller, type Validation } from '@/presentation/protocols'

export class CreateUserController implements Controller<CreateUserController.Params, CreateUserController.Result> {
  constructor (
    private readonly validation: Validation,
    private readonly validateIfUserExists: ValidateIfUserExists,
    private readonly createUser: CreateUser
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
      const result = await this.createUser.create(data)
      if (!result) return conflictError(new UnexpectedError())
      return ok(result)
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
