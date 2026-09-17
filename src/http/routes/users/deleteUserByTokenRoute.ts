import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { DeleteUserByTokenController } from '../../controllers/users/deleteUserByTokenController.ts'
import { authMiddleware } from '../../middlewres/authMiddleware.ts'
import { deleteUserByTokenSchema } from '../../schemas/users/deleteUserByTokenSchema.ts'

export const deleteUserByTokenRoute: FastifyPluginCallbackZod = (app) => {
  const controller = new DeleteUserByTokenController()

  app.delete(
    '/users/token',
    {
      preHandler: [authMiddleware],
      schema: deleteUserByTokenSchema,
    },
    async (request, reply) => controller.handle(request, reply)
  )
}
