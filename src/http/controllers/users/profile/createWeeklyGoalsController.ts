import type { FastifyReply, FastifyRequest } from 'fastify'
import { UserNotFoundError } from '../../../../services/users/errors.ts'
import { CreateWeeklyGoalsService } from '../../../../services/users/profile/createWeeklyGoalsService.ts'
import type { CreateWeeklyGoalsSchema } from '../../../schemas/users/profile/createWeeklyGoalsSchema.ts'

export class createWeeklyGoalsController {
  async handle(
    request: FastifyRequest<{ Body: CreateWeeklyGoalsSchema }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user?.id
      const service = new CreateWeeklyGoalsService()
      const result = await service.execute(userId, request.body)
      return reply.status(201).send(result)
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return reply.status(404).send({ error: error.message })
      }

      if (error instanceof Error) {
        return reply.status(500).send({ error: error.message })
      }

      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  }
}
