import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { GetActivityHeatmapController } from '../../../controllers/users/profile/getActivityHeatmapController.ts'
import { authMiddleware } from '../../../middlewares/authMiddleware.ts'
import { getActivityHeatmapSchema } from '../../../schemas/users/profile/getHeatmapSchema.ts'

export const getActivityHeatmapRoute: FastifyPluginCallbackZod = (app) => {
  const controller = new GetActivityHeatmapController()

  app.get(
    '/users/me/activity-heatmap',
    {
      preHandler: [authMiddleware],
      schema: getActivityHeatmapSchema,
    },
    async (request, reply) => controller.handle(request, reply)
  )
}
