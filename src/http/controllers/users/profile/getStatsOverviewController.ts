import type { FastifyReply, FastifyRequest } from 'fastify'
import { UserNotFoundError } from '../../../../services/users/errors.ts'
import { getStatsOverviewService } from '../../../../services/users/profile/getStatsOverviewService.ts'

export class GetStatsOverviewController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      // request.user.sub contém o ID do usuário (vindo do token JWT via middleware)
      const userId = request.user?.id
      const service = new getStatsOverviewService()

      const result = await service.execute(userId)
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
