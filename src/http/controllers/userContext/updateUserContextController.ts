import type { FastifyReply, FastifyRequest } from 'fastify'
import { UserContextNotFoundError } from '../../../services/userContext/error.ts'
import { UpdateUserContextService } from '../../../services/userContext/updateUserContextService.ts'
import { UserNotFoundError } from '../../../services/users/errors.ts'
import type { UpdateUserContextBody } from '../../schemas/userContext/updateUserContextSchema.ts'

export class UpdateUserContextController {
  async handle(
    request: FastifyRequest<{ Body: UpdateUserContextBody }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user?.id

      if (!userId) {
        return reply.status(401).send({ message: 'Não autorizado' })
      }

      const service = new UpdateUserContextService()
      const result = await service.execute(userId, request.body)

      return reply.status(200).send(result)
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return reply.status(404).send({ message: 'Usuário não encontrado' })
      }

      if (error instanceof UserContextNotFoundError) {
        return reply
          .status(404)
          .send({ message: 'Contexto do usuário não encontrado' })
      }

      console.error(error)
      return reply.status(500).send({ message: 'Erro interno do servidor' })
    }
  }
}
