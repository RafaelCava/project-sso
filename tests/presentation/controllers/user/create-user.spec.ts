import { type ValidateIfUserExists } from '@/domain/usecases'
import { CreateUserController } from '@/presentation/controllers/user'
import { faker } from '@faker-js/faker'

class ValidateIfUserExistsSpy implements ValidateIfUserExists {
  count = 0
  params: ValidateIfUserExists.Params
  async validate (data: ValidateIfUserExists.Params): Promise<boolean> {
    this.count++
    this.params = data
    return Promise.resolve(true)
  }
}

const makeRequest = (): CreateUserController.Params => ({
  email: faker.internet.email(),
  name: faker.person.fullName(),
  password: faker.internet.password(),
  avatar: faker.image.avatar()
})

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

  it('should call validateIfUserExists with correct values', async () => {
    const { sut, validateIfUserExistsSpy } = makeSut()
    const request = makeRequest()
    await sut.handle(request)
    expect(validateIfUserExistsSpy.count).toBe(1)
    expect(validateIfUserExistsSpy.params).toEqual({
      email: request.email
    })
  })
})
