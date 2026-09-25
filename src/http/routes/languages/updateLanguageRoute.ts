import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { UpdateLanguageController } from '../../controllers/languages/updateLanguageController.ts'
import { authMiddleware } from '../../middlewares/authMiddleware.ts'
import { updateLanguageSchema } from '../../schemas/languages/updateLanguageSchema.ts'

export const updateLanguageRoute: FastifyPluginCallbackZod = (app) => {
  const controller = new UpdateLanguageController()

  app.patch(
    '/languages/:slug',
    {
      preHandler: [authMiddleware],
      schema: updateLanguageSchema,
    },
    async (request, reply) => controller.handle(request, reply)
  )
}
