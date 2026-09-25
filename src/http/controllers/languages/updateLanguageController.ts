import type { FastifyReply, FastifyRequest } from 'fastify'
import {
  LanguageAlreadyExistError,
  LanguageNotFoundError,
} from '../../../services/languages/error.ts'
import { UpdateLanguageService } from '../../../services/languages/updateLanguageService.ts'
import type {
  UpdateLanguageBody,
  UpdateLanguageParams,
} from '../../schemas/languages/updateLanguageSchema.ts'

export class UpdateLanguageController {
  async handle(
    request: FastifyRequest<{
      Body: UpdateLanguageBody
      Params: UpdateLanguageParams
    }>,
    reply: FastifyReply
  ) {
    try {
      const { slug } = request.params
      const data = request.body

      const service = new UpdateLanguageService()
      const result = await service.execute(slug, data)

      return reply.status(200).send(result)
    } catch (error) {
      if (error instanceof LanguageNotFoundError) {
        return reply
          .status(404)
          .send({ message: 'Idioma não encontrado com o slug fornecido.' })
      }

      if (error instanceof LanguageAlreadyExistError) {
        return reply
          .status(409)
          .send({ message: 'Idioma já existe no sistema.' })
      }

      return reply.status(500).send({ message: 'Erro interno do servidor' })
    }
  }
}
