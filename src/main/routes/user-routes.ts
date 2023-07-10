import { type Router } from 'express'
import { adaptRoute } from '../adapters'
import { makeCreateUserController } from '../factories/controllers'

export default (router: Router): void => {
  router.post('/create', adaptRoute(makeCreateUserController()))
  router.use('/user', router)
}
