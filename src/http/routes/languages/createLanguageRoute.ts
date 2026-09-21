import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { CreateLanguageController } from '../../controllers/languages/createLanguageController.ts'
import { authMiddleware } from '../../middlewares/authMiddleware.ts'
import { createLanguageSchema } from '../../schemas/languages/create-language-schema.ts'

export const createLanguageRoute: FastifyPluginCallbackZod = (app) => {
  const controller = new CreateLanguageController()

  app.post(
    '/languages',
    {
      preHandler: [authMiddleware],
      schema: createLanguageSchema,
    },
    async (request, reply) => controller.handle(request, reply)
  )
}
