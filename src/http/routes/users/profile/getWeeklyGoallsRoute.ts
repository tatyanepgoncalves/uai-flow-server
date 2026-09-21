import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { GetWeeklyGoalsController } from '../../../controllers/users/profile/getWeeklyGoalsController.ts'
import { authMiddleware } from '../../../middlewares/authMiddleware.ts'
import { getWeeklyGoalsSchema } from '../../../schemas/users/profile/getWeeklyGoalsSchema.ts'

export const getWeeklyGoalsRoute: FastifyPluginCallbackZod = (app) => {
  const controller = new GetWeeklyGoalsController()

  app.get(
    '/users/me/goals/weekly',
    {
      preHandler: [authMiddleware],
      schema: getWeeklyGoalsSchema,
    },
    async (request, reply) => controller.handle(request, reply)
  )
}
