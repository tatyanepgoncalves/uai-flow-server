import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { CreateUserController } from '../../controllers/users/createUserController.ts'
import { createUserSchema } from '../../schemas/users/createUserSchema.ts'

export const createUserRoute: FastifyPluginCallbackZod = (app) => {
  const controller = new CreateUserController()
  app.post(
    '/users',
    {
      schema: createUserSchema,
    },
    async (request, reply) => controller.handle(request, reply)
  )
}
