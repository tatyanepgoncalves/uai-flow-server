import type { FastifyReply, FastifyRequest } from 'fastify'
import { CreateUserContextService } from '../../../services/userContext/createUserContextService.ts'
import { UserNotFoundError } from '../../../services/users/errors.ts'
import type { CreateUserContextBody } from '../../schemas/userContext/createUserContextSchema.ts'

export class CreateUserContextController {
  async handle(
    request: FastifyRequest<{ Body: CreateUserContextBody }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user?.id

      const service = new CreateUserContextService()
      const result = await service.execute(userId, request.body)

      return reply.status(200).send(result)
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return reply.status(404).send({ message: 'Usuário não encontrado' })
      }

      console.error(error)
      return reply.status(500).send({ message: 'Erro interno do servidor' })
    }
  }
}
