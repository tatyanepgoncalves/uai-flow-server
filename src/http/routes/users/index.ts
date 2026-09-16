import type { FastifyInstance } from 'fastify'
import { createUserRoute } from './createUserRoute.ts'
import { getUserProfileRoute } from './getUserProfileRoute.ts'
import { logoutUserRoute } from './logoutUserRoute.ts'

// biome-ignore lint/suspicious/useAwait: it not necessary
export async function userRoutes(app: FastifyInstance) {
  // ROTAS PÚBLICAS
  app.register(createUserRoute)

  // ROTAS COM AUTENTICAÇÃO NECESSÁRIA
  app.register(getUserProfileRoute)
  app.register(logoutUserRoute)
}
