import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { CreateUserContextController } from '../../controllers/userContext/createUserContextController.ts'
import { authMiddleware } from '../../middlewares/authMiddleware.ts'
import { authorizeSelf } from '../../middlewares/authorizeSelf.ts'
import { createUserContextSchema } from '../../schemas/userContext/createUserContextSchema.ts'

export const createUserContextRoute: FastifyPluginCallbackZod = (app) => {
  const controller = new CreateUserContextController()

  app.post(
    '/users/context',
    {
      preHandler: [authMiddleware, authorizeSelf],
      schema: createUserContextSchema,
    },
    async (request, reply) => controller.handle(request, reply)
  )
}
