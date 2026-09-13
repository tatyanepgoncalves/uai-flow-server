import type { FastifyReply, FastifyRequest } from 'fastify'
import { CreateUserService } from '../../../services/users/createUserService.ts'
import { UserAlreadyExistError } from '../../../services/users/errors.ts'
import type { CreateUserSchema } from '../../schemas/users/createUserSchema.ts'

export class CreateUserController {
  async handle(
    request: FastifyRequest<{ Body: CreateUserSchema }>,
    reply: FastifyReply
  ) {
    try {
      const service = new CreateUserService()
      const result = await service.execute(request.body)
      return reply.status(201).send(result)
    } catch (error) {
      if (error instanceof UserAlreadyExistError) {
        return reply.status(409).send({ error: error.message })
      }

      return reply
        .status(500)
        .send({ error: 'Erro inesperado no cadastro do usuário.' })
    }
  }
}
