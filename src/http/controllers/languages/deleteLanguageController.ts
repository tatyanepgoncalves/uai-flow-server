import type { FastifyReply, FastifyRequest } from 'fastify'
import { DeleteLanguageService } from '../../../services/languages/deleteLanguageService.ts'
import { LanguageNotFoundError } from '../../../services/languages/error.ts'
import type { DeleteLanguageQuery } from '../../schemas/languages/deleteLanguageSchema.ts'

export class deleteLanguageController {
  async handle(
    request: FastifyRequest<{
      Querystring: DeleteLanguageQuery
    }>,
    reply: FastifyReply
  ) {
    try {
      const service = new DeleteLanguageService()
      const { id, slug } = request.query
      const result = await service.execute({ id, slug })
      reply.status(200).send(result)
    } catch (error) {
      if (error instanceof LanguageNotFoundError) {
        return reply.status(404).send({
          message: 'Idioma não encontrado com a credencial fornecida.',
        })
      }

      reply.status(500).send({ message: 'Erro interno do servidor' })
    }
  }
}
