import { type ValidateIfUserExists } from '@/domain/usecases'
import { CreateUserController } from '@/presentation/controllers/user'
import { EmailInUseError, MissingParamError } from '@/presentation/errors'
import { badRequest } from '@/presentation/helpers/http-helper'
import { faker } from '@faker-js/faker'

class ValidateIfUserExistsSpy implements ValidateIfUserExists {
  count = 0
  params: ValidateIfUserExists.Params
  async validate (data: ValidateIfUserExists.Params): Promise<boolean> {
    this.count++
    this.params = data
    return Promise.resolve(false)
  }
}

const makeRequest = (paramsToRemove?: string): CreateUserController.Params => {
  const request = {
    email: faker.internet.email(),
    name: faker.person.fullName(),
    password: faker.internet.password(),
    avatar: faker.image.avatar()
  }
  if (paramsToRemove) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete request[paramsToRemove]
  }
  return request
}

type SutTypes = {
  sut: CreateUserController
  validateIfUserExistsSpy: ValidateIfUserExistsSpy
}

const makeSut = (): SutTypes => {
  const validateIfUserExistsSpy = new ValidateIfUserExistsSpy()
  const sut = new CreateUserController(validateIfUserExistsSpy)
  return {
    sut,
    validateIfUserExistsSpy
  }
}

describe('CreateUser Controller', () => {
  it('should be defined', () => {
    const { sut, validateIfUserExistsSpy } = makeSut()
    expect(sut).toBeDefined()
    expect(validateIfUserExistsSpy).toBeDefined()
  })

  it('should return bad request if handle is called with invalid params', async () => {
    const { sut } = makeSut()
    let request = {}
    for (const field of ['email', 'name', 'password']) {
      request = makeRequest(field)
      const result = await sut.handle(request as any)
      expect(result).toEqual(badRequest(new MissingParamError(field)))
    }
  })

  it('should call validateIfUserExists with correct values', async () => {
    const { sut, validateIfUserExistsSpy } = makeSut()
    const request = makeRequest()
    await sut.handle(request)
    expect(validateIfUserExistsSpy.count).toBe(1)
    expect(validateIfUserExistsSpy.params).toEqual({
      email: request.email
    })
  })

  it('should return bad request if validateIfUserExists returns true', async () => {
    const { sut, validateIfUserExistsSpy } = makeSut()
    jest.spyOn(validateIfUserExistsSpy, 'validate').mockResolvedValueOnce(Promise.resolve(true))
    const request = makeRequest()
    const result = await sut.handle(request)
    expect(result).toEqual(badRequest(new EmailInUseError()))
  })
})
