import type { FastifyReply, FastifyRequest } from 'fastify'
import {
  UserAlreadyExistsError,
  UserNotFoundError,
} from '../../../services/users/errors.ts'
import { UpdateUserService } from '../../../services/users/updateUserService.ts'
import type { UpdateUserBodySchema } from '../../schemas/users/updateUserSchema.ts'

export class UpdateUserController {
  async handle(
    request: FastifyRequest<{
      Body: UpdateUserBodySchema
    }>,
    reply: FastifyReply
  ) {
    // Implementation for handling update user request
    const userId = request.user?.id
    const service = new UpdateUserService()

    try {
      const result = await service.execute(userId, request.body)

      return reply.status(200).send(result)
      // biome-ignore lint/suspicious/noExplicitAny: it's necessary
    } catch (error: any) {
      if (error instanceof UserNotFoundError) {
        return reply.status(404).send({ message: error.message })
      }

      if (error instanceof UserAlreadyExistsError || error.code === '23505') {
        return reply.status(409).send({
          message: 'Email ou telefone já cadastrado por outro usuário.',
        })
      }

      return reply.status(500).send({ message: 'Erro ao atualizar usuário.' })
    }
  }
}
