import { type Controller } from '@/presentation/protocols'

export class CreateUserController implements Controller {
  async handle (data: any): Promise<any> {
    return Promise.resolve(null)
  }
}
