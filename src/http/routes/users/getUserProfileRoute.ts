import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { GetUserProfileController } from '../../controllers/users/getUserProfileController.ts'
import { authMiddleware } from '../../middlewres/authMiddleware.ts'
import { getUserProfileSchema } from '../../schemas/users/getUserProfileSchema.ts'

export const getUserProfileRoute: FastifyPluginCallbackZod = (app) => {
  const controller = new GetUserProfileController()

  app.get(
    '/users/me',
    {
      preHandler: [authMiddleware],
      schema: getUserProfileSchema,
    },
    async (request, reply) => controller.handle(request, reply)
  )
}
