import type { FastifyReply, FastifyRequest } from 'fastify'
import { CreateLanguageService } from '../../../services/languages/createLanguageService.ts'
import { UserNotFoundError } from '../../../services/users/errors.ts'
import type { CreateLanguageSchema } from '../../schemas/languages/create-language-schema.ts'

export class CreateLanguageController {
  async handle(
    request: FastifyRequest<{ Body: CreateLanguageSchema }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user?.id

      const service = new CreateLanguageService()
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
