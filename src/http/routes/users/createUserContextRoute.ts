import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { CreateUserContextController } from '../../controllers/users/createUserContextController.ts'
import { authMiddleware } from '../../middlewares/authMiddleware.ts'
import { createUserContextSchema } from '../../schemas/users/createUserContextSchema.ts'

export const createUserContextRoute: FastifyPluginCallbackZod = (app) => {
  const controller = new CreateUserContextController()

  app.post(
    '/users/me/context',
    {
      preHandler: [authMiddleware],
      schema: createUserContextSchema,
    },
    async (request, reply) => controller.handle(request, reply)
  )
}
