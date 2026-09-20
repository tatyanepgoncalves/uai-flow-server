import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { UpdateUserContextController } from '../../controllers/users/updateUserContextController.ts'
import { authMiddleware } from '../../middlewares/authMiddleware.ts'
import { updateUserContextSchema } from '../../schemas/users/updateUserContextSchema.ts'

export const updateUserContextRoute: FastifyPluginCallbackZod = (app) => {
  const controller = new UpdateUserContextController()

  app.patch(
    '/users/me/context',
    {
      preHandler: [authMiddleware],
      schema: updateUserContextSchema,
    },
    async (request, reply) => controller.handle(request, reply)
  )
}
