import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { GetStatsOverviewController } from '../../../controllers/users/profile/getStatsOverviewController.ts'
import { authMiddleware } from '../../../middlewares/authMiddleware.ts'
import { getStatsOverviewSchema } from '../../../schemas/users/profile/getStatsOverviewSchema.ts'

export const getStatsOverviewRoute: FastifyPluginCallbackZod = (app) => {
  const controller = new GetStatsOverviewController()

  app.get(
    '/users/me/stats/overview',
    {
      preHandler: [authMiddleware],
      schema: getStatsOverviewSchema,
    },
    async (request, reply) => controller.handle(request, reply)
  )
}
