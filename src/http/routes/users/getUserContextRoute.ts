import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { GetUserContextController } from '../../controllers/users/getUserContextController.ts'
import { authMiddleware } from '../../middlewares/authMiddleware.ts'
import { getUserContextSchema } from '../../schemas/users/getUserContextSchema.ts'

export const getUserContextRoute: FastifyPluginCallbackZod = (app) => {
  const controller = new GetUserContextController()

  app.get(
    '/users/me/context',
    {
      preHandler: [authMiddleware],
      schema: getUserContextSchema,
    },
    async (request, reply) => controller.handle(request, reply)
  )
}
