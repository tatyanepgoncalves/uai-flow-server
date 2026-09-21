import type { FastifyReply, FastifyRequest } from 'fastify'
import {
  UserNotFoundError,
  UserWeeklyGoalsNotFoundError,
} from '../../../../services/users/errors.ts'
import { UpdateWeeklyGoalsService } from '../../../../services/users/profile/updateWeeklyGoalsService.ts'
import type { UpdateWeeklyGoalsSchema } from '../../../schemas/users/profile/updateWeeklyGoalsSchema.ts'

export class UpdateWeeklyGoalsController {
  async handle(
    request: FastifyRequest<{ Body: UpdateWeeklyGoalsSchema }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user?.id
      const service = new UpdateWeeklyGoalsService()

      const result = await service.execute(userId, request.body)
      return reply.status(200).send(result)
    } catch (error) {
      if (
        error instanceof UserNotFoundError ||
        error instanceof UserWeeklyGoalsNotFoundError
      ) {
        return reply.status(404).send({ error: error.message })
      }

      if (error instanceof Error) {
        return reply.status(500).send({ error: error.message })
      }

      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  }
}
