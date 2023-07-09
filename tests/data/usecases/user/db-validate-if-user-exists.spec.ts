import { type FindOneUserRepository } from '@/data/protocols'
import { DbValidateIfUserExists } from '@/data/usecases'
import { makeUser } from '@/tests/domain/mocks'
import { faker } from '@faker-js/faker'

class FindOneUserRepositorySpy implements FindOneUserRepository {
  query?: FindOneUserRepository.Query
  projection?: FindOneUserRepository.Projection
  count = 0
  async findOne (query: FindOneUserRepository.Query, projection: FindOneUserRepository.Projection): FindOneUserRepository.Result {
    this.query = query
    this.projection = projection
    this.count++
    return Promise.resolve(makeUser())
  }
}

type SutTypes = {
  sut: DbValidateIfUserExists
  findOneUserRepositorySpy: FindOneUserRepositorySpy
}
const makeSut = (): SutTypes => {
  const findOneUserRepositorySpy = new FindOneUserRepositorySpy()
  const sut = new DbValidateIfUserExists(findOneUserRepositorySpy)
  return {
    sut,
    findOneUserRepositorySpy
  }
}

describe('DbValidateIfUserExists', () => {
  it('should be defined', () => {
    const { sut, findOneUserRepositorySpy } = makeSut()
    expect(sut).toBeDefined()
    expect(findOneUserRepositorySpy).toBeDefined()
  })

  it('should call findOneUserRepository with correct values', async () => {
    const { sut, findOneUserRepositorySpy } = makeSut()
    const request = {
      email: faker.internet.email()
    }
    await sut.validate(request)
    expect(findOneUserRepositorySpy.count).toBe(1)
    expect(findOneUserRepositorySpy.query).toEqual(request)
    expect(findOneUserRepositorySpy.projection).toEqual({ id: 1 })
  })

  it('should throw if findOneUserRepository throws', async () => {
    const { sut, findOneUserRepositorySpy } = makeSut()
    jest.spyOn(findOneUserRepositorySpy, 'findOne').mockResolvedValueOnce(Promise.reject(new Error('unexpected error')))
    const promise = sut.validate({ email: faker.internet.email() })
    await expect(promise).rejects.toThrow(new Error('unexpected error'))
  })

  it('should return false if findOneUserRepository returns null', async () => {
    const { sut, findOneUserRepositorySpy } = makeSut()
    jest.spyOn(findOneUserRepositorySpy, 'findOne').mockResolvedValueOnce(Promise.resolve(null))
    const result = await sut.validate({ email: faker.internet.email() })
    expect(result).toBe(false)
  })
})
