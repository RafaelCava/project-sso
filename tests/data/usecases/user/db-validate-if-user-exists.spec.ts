import { DbValidateIfUserExists } from '@/data/usecases'

type SutTypes = {
  sut: DbValidateIfUserExists
}
const makeSut = (): SutTypes => {
  const sut = new DbValidateIfUserExists()
  return {
    sut
  }
}

describe('DbValidateIfUserExists', () => {
  it('should be defined', () => {
    const { sut } = makeSut()
    expect(sut).toBeDefined()
  })
})
