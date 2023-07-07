import { CreateUserController } from '@/presentation/controllers/user'

type SutTypes = {
  sut: CreateUserController
}
const makeSut = (): SutTypes => {
  const sut = new CreateUserController()
  return {
    sut
  }
}

describe('CreateUser Controller', () => {
  it('should be defined', () => {
    const { sut } = makeSut()
    expect(sut).toBeDefined()
  })
})
