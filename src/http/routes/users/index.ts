import type { FastifyInstance } from 'fastify'
import { createUserRoute } from './createUserRoute.ts'
import { deleteUserByTokenRoute } from './deleteUserByTokenRoute.ts'
import { loginUserRoute } from './loginUserRoute.ts'
import { logoutUserRoute } from './logoutUserRoute.ts'
import { updateUserRoute } from './updateUserRoute.ts'

// biome-ignore lint/suspicious/useAwait: it not necessary
export async function userRoutes(app: FastifyInstance) {
  // ROTAS PÚBLICAS
  app.register(createUserRoute)
  app.register(loginUserRoute)

  // ROTAS COM AUTENTICAÇÃO NECESSÁRIA
  app.register(updateUserRoute)
  app.register(logoutUserRoute)
  app.register(deleteUserByTokenRoute)
}
