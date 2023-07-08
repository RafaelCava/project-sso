import { type Hasher, type CreateUserRepository } from '@/data/protocols'
import { DbCreateUser } from '@/data/usecases'
import { makeUser } from '@/tests/domain/mocks'
import { faker } from '@faker-js/faker'

class CreateUserRepositorySpy implements CreateUserRepository {
  count = 0
  params: CreateUserRepository.Params
  async create (data: CreateUserRepository.Params): Promise<CreateUserRepository.Result> {
    this.count++
    this.params = data
    return Promise.resolve(makeUser())
  }
}

class HasherSpy implements Hasher {
  count = 0
  params?: string
  async hash (plaintext: string): Promise<string> {
    this.count++
    this.params = plaintext
    return Promise.resolve(faker.string.uuid())
  }
}

type SutTypes = {
  sut: DbCreateUser
  createUserRepositorySpy: CreateUserRepositorySpy
  hasherSpy: HasherSpy
}

const makeSut = (): SutTypes => {
  const createUserRepositorySpy = new CreateUserRepositorySpy()
  const hasherSpy = new HasherSpy()
  const sut = new DbCreateUser(hasherSpy, createUserRepositorySpy)
  return {
    sut,
    hasherSpy,
    createUserRepositorySpy
  }
}

const makeRequest = (): CreateUserRepository.Params => ({
  email: faker.internet.email(),
  name: faker.person.fullName(),
  password: faker.internet.password(),
  avatar: faker.image.avatar()
})

describe('DbCreateUser', () => {
  it('should be defined', () => {
    const { sut, createUserRepositorySpy, hasherSpy } = makeSut()
    expect(sut).toBeDefined()
    expect(createUserRepositorySpy).toBeDefined()
    expect(hasherSpy).toBeDefined()
  })

  it('should call Hasher with correct values', async () => {
    const { sut, hasherSpy } = makeSut()
    const request = makeRequest()
    await sut.create(request)
    expect(hasherSpy.count).toBe(1)
    expect(hasherSpy.params).toBe(request.password)
  })

  it('should throw if Hasher throws', async () => {
    const { sut, hasherSpy } = makeSut()
    jest.spyOn(hasherSpy, 'hash').mockRejectedValueOnce(new Error())
    const promise = sut.create(makeRequest())
    await expect(promise).rejects.toThrow()
  })

  it('should call CreateUserRepository with correct values', async () => {
    const { sut, createUserRepositorySpy, hasherSpy } = makeSut()
    const request = makeRequest()
    const hash = await hasherSpy.hash(request.password)
    jest.spyOn(hasherSpy, 'hash').mockResolvedValueOnce(Promise.resolve(hash))
    await sut.create(request)
    expect(createUserRepositorySpy.count).toBe(1)
    expect(createUserRepositorySpy.params).toEqual({
      ...request,
      password: hash
    })
  })

  it('should throw if CreateUserRepository throws', async () => {
    const { sut, createUserRepositorySpy } = makeSut()
    jest.spyOn(createUserRepositorySpy, 'create').mockRejectedValueOnce(new Error())
    const promise = sut.create(makeRequest())
    await expect(promise).rejects.toThrow()
  })

  it('should return an user without password on success', async () => {
    const { sut, createUserRepositorySpy } = makeSut()
    const request = makeRequest()
    const mockUser = makeUser()
    jest.spyOn(createUserRepositorySpy, 'create').mockResolvedValueOnce(Promise.resolve(mockUser))
    const response = await sut.create(request)
    delete mockUser.password
    expect(response).toEqual(mockUser)
  })
})
