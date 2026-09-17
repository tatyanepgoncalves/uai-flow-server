import type { FastifyReply, FastifyRequest } from 'fastify'
import { DeleteUserByTokenService } from '../../../services/users/deleteUserByTokenService.ts'
import { UserNotFoundError } from '../../../services/users/errors.ts'

export class DeleteUserByTokenController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const service = new DeleteUserByTokenService()

      const result = await service.execute(request.user?.id)

      return reply.status(200).send(result)
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return reply.status(404).send({ message: 'Usuário não encontrado' })
      }

      return reply.status(500).send({ message: 'Error interno do servidor.' })
    }
  }
}
