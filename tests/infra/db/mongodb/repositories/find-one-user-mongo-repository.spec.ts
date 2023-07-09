import { FindOneUserMongoRepository } from '@/infra/db/mongodb/repositories'

const makeSut = (): FindOneUserMongoRepository => {
  return new FindOneUserMongoRepository()
}
describe('FindOneUserMongoRepository', () => {
  it('should be defined', () => {
    const sut = makeSut()
    expect(sut).toBeDefined()
  })
})
