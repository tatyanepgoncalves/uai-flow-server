import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { UpdateUserContextController } from '../../controllers/userContext/updateUserContextController.ts'
import { authMiddleware } from '../../middlewares/authMiddleware.ts'
import { updateUserContextSchema } from '../../schemas/userContext/updateUserContextSchema.ts'

export const updateUserContextRoute: FastifyPluginCallbackZod = (app) => {
  const controller = new UpdateUserContextController()

  app.patch(
    '/context',
    {
      preHandler: [authMiddleware],
      schema: updateUserContextSchema,
    },
    async (request, reply) => controller.handle(request, reply)
  )
}
