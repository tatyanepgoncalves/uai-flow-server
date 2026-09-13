import type { FastifyReply, FastifyRequest } from 'fastify'
import { UserNotFoundError } from '../../../services/users/errors.ts'
import { LogoutUserService } from '../../../services/users/logoutUserService.ts'

export class LogoutUserController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      // Get the user ID from the request
      const userId = request.user?.id

      const service = new LogoutUserService()

      const result = await service.execute(userId)
      return reply.send(result)
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return reply.status(404).send({ message: error.message })
      }
      return reply.status(500).send({ message: 'Ocorreu um erro inesperado.' })
    }
  }
}
