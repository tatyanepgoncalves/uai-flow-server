import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { UpdateWeeklyGoalsController } from '../../../controllers/users/profile/updateWeeklyGoalsController.ts'
import { authMiddleware } from '../../../middlewares/authMiddleware.ts'
import { updateWeeklyGoalsSchema } from '../../../schemas/users/profile/updateWeeklyGoalsSchema.ts'

export const updateWeeklyGoalsRoute: FastifyPluginCallbackZod = (app) => {
  const controller = new UpdateWeeklyGoalsController()

  app.patch(
    '/users/me/goals/weekly',
    {
      preHandler: [authMiddleware],
      schema: updateWeeklyGoalsSchema,
    },
    async (request, reply) => controller.handle(request, reply)
  )
}
