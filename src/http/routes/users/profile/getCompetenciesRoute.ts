import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { GetCompetenciesController } from '../../../controllers/users/profile/getCompetenciesController.ts'
import { authMiddleware } from '../../../middlewares/authMiddleware.ts'
import { getCompetenciesSchema } from '../../../schemas/users/profile/getCompetenciesSchema.ts'

export const getCompetenciesRoute: FastifyPluginCallbackZod = (app) => {
  const controller = new GetCompetenciesController()

  app.get(
    '/users/me/competencies',
    {
      preHandler: [authMiddleware],
      schema: getCompetenciesSchema,
    },
    async (request, reply) => controller.handle(request, reply)
  )
}
