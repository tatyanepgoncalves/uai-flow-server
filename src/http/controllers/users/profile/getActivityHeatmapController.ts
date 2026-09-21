import type { FastifyReply, FastifyRequest } from 'fastify'
import { UserNotFoundError } from '../../../../services/users/errors.ts'
import { GetActivityHeatmapService } from '../../../../services/users/profile/getActivityHeatmapService.ts'
import type { GetActivityHeatmapSchema } from '../../../schemas/users/profile/getHeatmapSchema.ts'

export class GetActivityHeatmapController {
  async handle(
    request: FastifyRequest<{ Querystring: GetActivityHeatmapSchema }>,
    reply: FastifyReply
  ) {
    try {
      const { days } = request.query
      const userId = request.user?.id

      if (!userId) {
        return reply.status(401).send({ message: 'Usuário não autenticado' })
      }

      const service = new GetActivityHeatmapService()
      const result = await service.execute(days, userId)

      return reply.status(200).send(result)
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
