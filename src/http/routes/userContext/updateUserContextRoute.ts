import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { UpdateUserContextController } from '../../controllers/userContext/updateUserContextController.ts'
import { authMiddleware } from '../../middlewares/authMiddleware.ts'
import { authorizeSelf } from '../../middlewares/authorizeSelf.ts'
import { updateUserContextSchema } from '../../schemas/userContext/updateUserContextSchema.ts'

export const updateUserContextRoute: FastifyPluginCallbackZod = (app) => {
  const controller = new UpdateUserContextController()

  app.patch(
    '/users/context',
    {
      preHandler: [authMiddleware, authorizeSelf],
      schema: updateUserContextSchema,
    },
    async (request, reply) => controller.handle(request, reply)
  )
}
