import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { LoginUserController } from '../../controllers/users/loginUserController.ts'
import { loginUserSchema } from '../../schemas/users/loginUserSchema.ts'

export const loginUserRoute: FastifyPluginCallbackZod = (app) => {
  const controller = new LoginUserController()

  app.post(
    '/users/session',
    {
      schema: loginUserSchema,
    },
    async (request, reply) => controller.handle(request, reply)
  )
}
