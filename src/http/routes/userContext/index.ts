import type { FastifyInstance } from 'fastify'
import { createUserContextRoute } from './createUserContextRoute.ts'

// biome-ignore lint/suspicious/useAwait: it not necessary
export async function userContextRoutes(app: FastifyInstance) {
  // ROTAS COM AUTENTICAÇÃO NECESSÁRIA
  app.register(createUserContextRoute)
}
