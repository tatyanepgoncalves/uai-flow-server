import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { authMiddleware } from '../../middlewares/authMiddleware.ts'
import { deleteLanguageTemporaryController } from '../../controllers/languages/deleteLanguageTemporaryController.ts'
import { deleteLanguageTemporarySchema } from '../../schemas/languages/deleteLanguageTemporarySchema.ts'

export const deleteLanguageTemporaryRoute: FastifyPluginCallbackZod = (app) => {
  const controller = new deleteLanguageTemporaryController()

  app.patch(
    '/delete-temporary-language',
    {
      preHandler: [authMiddleware],
      schema: deleteLanguageTemporarySchema,
    },
    async (request, reply) => controller.handle(request, reply)
  )
}
