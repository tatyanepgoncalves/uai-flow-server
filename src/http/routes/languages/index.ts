import type { FastifyInstance } from 'fastify'
import { createLanguageRoute } from './createLanguageRoute.ts'
import { updateLanguageRoute } from './updateLanguageRoute.ts'

// biome-ignore lint/suspicious/useAwait: it not necessary
export async function languageRoutes(app: FastifyInstance) {
  app.register(createLanguageRoute)
  app.register(updateLanguageRoute)
}
