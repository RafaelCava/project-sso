import { type ValidateIfUserExists } from '@/domain/usecases'
import { type CreateUser } from '@/domain/usecases/user'
import { CreateUserController } from '@/presentation/controllers/user'
import { EmailInUseError, InvalidParamError, MissingParamError } from '@/presentation/errors'
import { badRequest, serverError } from '@/presentation/helpers/http-helper'
import { type Validation } from '@/presentation/protocols'
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

class RequiredFieldValidationSpy implements Validation {
  constructor (
    private readonly fieldName: string
  ) {}

  input: any
  count = 0
  validate (input: any): Error {
    this.count++
    this.input = input
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName)
    }
  }
}

class EmailValidationSpy implements Validation {
  constructor (private readonly fieldName: string, private readonly emailValidator: any) {}
  validate (input: any): Error | null {
    return null
  }
}

class ValidationCompositeSpy implements Validation {
  constructor (
    private readonly validations: Validation[]
  ) {}

  validate (data: any): Error {
    for (const validation of this.validations) {
      const error = validation.validate(data)
      if (error) {
        return error
      }
    }
  }
}

class DbCreateUserSpy implements CreateUser {
  count = 0
  params: CreateUser.Params
  async create (data: CreateUser.Params): Promise<boolean> {
    this.count++
    this.params = data
    return Promise.resolve(true)
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
  validationSpy: ValidationCompositeSpy
  validateIfUserExistsSpy: ValidateIfUserExistsSpy
  emailValidationSpy: EmailValidationSpy
  requiredFieldEmailValidationSpy: RequiredFieldValidationSpy
  requiredFieldNameValidationSpy: RequiredFieldValidationSpy
  requiredFieldPasswordValidationSpy: RequiredFieldValidationSpy
  dbCreateUserSpy: DbCreateUserSpy
}

const makeSut = (): SutTypes => {
  const emailValidationSpy = new EmailValidationSpy('email', jest.fn())
  const requiredFieldEmailValidationSpy = new RequiredFieldValidationSpy('email')
  const requiredFieldNameValidationSpy = new RequiredFieldValidationSpy('name')
  const requiredFieldPasswordValidationSpy = new RequiredFieldValidationSpy('password')
  const validationSpy = new ValidationCompositeSpy([requiredFieldEmailValidationSpy, requiredFieldNameValidationSpy, requiredFieldPasswordValidationSpy, emailValidationSpy])
  const validateIfUserExistsSpy = new ValidateIfUserExistsSpy()
  const dbCreateUserSpy = new DbCreateUserSpy()
  const sut = new CreateUserController(validationSpy, validateIfUserExistsSpy, dbCreateUserSpy)
  return {
    sut,
    validationSpy,
    validateIfUserExistsSpy,
    emailValidationSpy,
    requiredFieldEmailValidationSpy,
    requiredFieldNameValidationSpy,
    requiredFieldPasswordValidationSpy,
    dbCreateUserSpy
  }
}

describe('CreateUser Controller', () => {
  it('should be defined', () => {
    const {
      sut,
      validateIfUserExistsSpy,
      emailValidationSpy,
      requiredFieldEmailValidationSpy,
      requiredFieldNameValidationSpy,
      requiredFieldPasswordValidationSpy,
      validationSpy,
      dbCreateUserSpy
    } = makeSut()
    expect(sut).toBeDefined()
    expect(validateIfUserExistsSpy).toBeDefined()
    expect(emailValidationSpy).toBeDefined()
    expect(requiredFieldEmailValidationSpy).toBeDefined()
    expect(requiredFieldNameValidationSpy).toBeDefined()
    expect(requiredFieldPasswordValidationSpy).toBeDefined()
    expect(validationSpy).toBeDefined()
    expect(dbCreateUserSpy).toBeDefined()
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

  it('should return bad request if handle is called with invalid email', async () => {
    const { sut, emailValidationSpy } = makeSut()
    let request = makeRequest()
    request = {
      ...request,
      email: faker.string.uuid()
    }
    jest.spyOn(emailValidationSpy, 'validate').mockReturnValueOnce(new InvalidParamError('email'))
    const result = await sut.handle(request as any)
    expect(result).toEqual(badRequest(new InvalidParamError('email')))
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

  it('should return internal server error if validateIfUserExists throws', async () => {
    const { sut, validateIfUserExistsSpy } = makeSut()
    jest.spyOn(validateIfUserExistsSpy, 'validate').mockRejectedValueOnce(new Error())
    const request = makeRequest()
    const result = await sut.handle(request)
    expect(result).toEqual(serverError(new Error()))
  })

  it('should return bad request if validateIfUserExists returns true', async () => {
    const { sut, validateIfUserExistsSpy } = makeSut()
    jest.spyOn(validateIfUserExistsSpy, 'validate').mockResolvedValueOnce(Promise.resolve(true))
    const request = makeRequest()
    const result = await sut.handle(request)
    expect(result).toEqual(badRequest(new EmailInUseError()))
  })

  it('should call CreateUser with correct values', async () => {
    const { sut, dbCreateUserSpy } = makeSut()
    const request = makeRequest()
    await sut.handle(request)
    expect(dbCreateUserSpy.count).toBe(1)
    expect(dbCreateUserSpy.params).toEqual(request)
  })
})
