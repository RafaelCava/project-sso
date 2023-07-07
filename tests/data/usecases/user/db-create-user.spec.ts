import { DbCreateUser } from '@/data/usecases'

type SutTypes = {
  sut: DbCreateUser
}

const makeSut = (): SutTypes => {
  const sut = new DbCreateUser()
  return {
    sut
  }
}

describe('DbCreateUser', () => {
  it('should be defined', () => {
    const { sut } = makeSut()
    expect(sut).toBeDefined()
  })
})
