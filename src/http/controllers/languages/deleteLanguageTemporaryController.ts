import type { FastifyReply, FastifyRequest } from 'fastify'
import { DeleteLanguageService } from '../../../services/languages/deleteLanguageService.ts'
import { LanguageNotFoundError } from '../../../services/languages/error.ts'
import type { DeleteLanguageTemporaryQuery } from '../../schemas/languages/deleteLanguageTemporarySchema.ts'
import { DeleteLanguageTemporaryService } from '../../../services/languages/deleteLanguageTemporaryService.ts'

export class deleteLanguageTemporaryController {
  async handle(
    request: FastifyRequest<{
      Querystring: DeleteLanguageTemporaryQuery
    }>,
    reply: FastifyReply
  ) {
    try {
      const service = new DeleteLanguageTemporaryService()
      const { id, slug } = request.query
      const result = await service.execute({ id, slug })
      reply.status(200).send(result)
    } catch (error) {
      if (error instanceof Error) {
        return reply.status(400).send({
          message: 'Não foi possível deletar temporariamente o idioma.',
        })
      }
      
      if (error instanceof LanguageNotFoundError) {
        return reply.status(404).send({
          message: 'Idioma não encontrado com a credencial fornecida.',
        })
      }

      reply.status(500).send({ message: 'Erro interno do servidor' })
    }
  }
}
