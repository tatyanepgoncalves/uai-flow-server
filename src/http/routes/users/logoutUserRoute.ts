import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { LogoutUserController } from '../../controllers/users/logoutUserController.ts'
import { authMiddleware } from '../../middlewares/authMiddleware.ts'
import { logoutUserSchema } from '../../schemas/users/logoutUserSchema.ts'

export const logoutUserRoute: FastifyPluginCallbackZod = (app) => {
  const controller = new LogoutUserController()

  app.post(
    '/users/logout',
    {
      preHandler: [authMiddleware],
      schema: logoutUserSchema,
    },
    async (request, reply) => controller.handle(request, reply)
  )
}
