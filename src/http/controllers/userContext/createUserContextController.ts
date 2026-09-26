import type { FastifyReply, FastifyRequest } from 'fastify'
import { LanguageNotFoundError } from '../../../services/languages/error.ts'
import { CreateUserContextService } from '../../../services/userContext/createUserContextService.ts'
import { UserContextAlreadyExistForThisLanguageError } from '../../../services/userContext/error.ts'
import { UserNotFoundError } from '../../../services/users/errors.ts'
import type {
  CreateUserContextBody,
  CreateUserContextQuery,
} from '../../schemas/userContext/createUserContextSchema.ts'

export class CreateUserContextController {
  async handle(
    request: FastifyRequest<{
      Body: CreateUserContextBody
      Querystring: CreateUserContextQuery
    }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user?.id

      const service = new CreateUserContextService()
      const result = await service.execute(userId, request.body, request.query)

      return reply.status(200).send(result)
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return reply.status(404).send({ message: 'Usuário não encontrado' })
      }

      if (error instanceof LanguageNotFoundError) {
        return reply.status(404).send({ message: 'Idioma não encontrado' })
      }

      if (error instanceof UserContextAlreadyExistForThisLanguageError) {
        return reply.status(409).send({
          message: 'Já existe um contexto cadastrado para este idioma.',
        })
      }

      return reply.status(500).send({ message: 'Erro interno do servidor' })
    }
  }
}
