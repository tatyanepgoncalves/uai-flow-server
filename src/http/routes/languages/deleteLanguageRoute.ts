import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { deleteLanguageController } from '../../controllers/languages/deleteLanguageController.ts'
import { authMiddleware } from '../../middlewares/authMiddleware.ts'
import { deleteLanguageSchema } from '../../schemas/languages/deleteLanguageSchema.ts'

export const deleteLanguageRoute: FastifyPluginCallbackZod = (app) => {
  const controller = new deleteLanguageController()

  app.delete(
    '/delete-language',
    {
      preHandler: [authMiddleware],
      schema: deleteLanguageSchema,
    },
    async (request, reply) => controller.handle(request, reply)
  )
}
