import type { FastifyReply, FastifyRequest } from 'fastify'
import { UserNotFoundError } from '../../../services/users/errors.ts'
import { GetUserContextsService } from '../../../services/users/getUserContextService.ts'

export class GetUserContextController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user?.id

      const service = new GetUserContextsService()

      const result = await service.execute(userId)

      return reply.status(200).send(result)
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return reply.status(404).send({ message: 'Usuário não encontrado' })
      }
      return reply.status(500).send({ message: 'Erro interno do servidor' })
    }
  }
}
