import { type ValidateIfUserExists } from '@/domain/usecases'

export class DbValidateIfUserExists implements ValidateIfUserExists {
  async validate (data: ValidateIfUserExists.Params): Promise<boolean> {
    return Promise.resolve(false)
  }
}
