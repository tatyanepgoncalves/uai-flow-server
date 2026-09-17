import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { UpdateUserController } from '../../controllers/users/updateUserController.ts'
import { authMiddleware } from '../../middlewres/authMiddleware.ts'
import { updateUserSchema } from '../../schemas/users/updateUserSchema.ts'

export const updateUserRoute: FastifyPluginCallbackZod = (app) => {
  const controller = new UpdateUserController()

  app.put(
    '/users/me',
    {
      preHandler: [authMiddleware],
      schema: updateUserSchema,
    },
    async (request, reply) => controller.handle(request, reply)
  )
}
