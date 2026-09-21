import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { createWeeklyGoalsController } from '../../../controllers/users/profile/createWeeklyGoalsController.ts'
import { authMiddleware } from '../../../middlewares/authMiddleware.ts'
import { createWeeklyGoalsSchema } from '../../../schemas/users/profile/createWeeklyGoalsSchema.ts'

export const createWeeklyGoalsRoute: FastifyPluginCallbackZod = (app) => {
  const controller = new createWeeklyGoalsController()

  app.post(
    '/users/me/goals/weekly',
    {
      preHandler: [authMiddleware],
      schema: createWeeklyGoalsSchema,
    },
    async (request, reply) => controller.handle(request, reply)
  )
}
