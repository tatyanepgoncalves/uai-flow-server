import type { FastifyInstance } from 'fastify'
import { createUserContextRoute } from './createUserContextRoute.ts'
import { createUserRoute } from './createUserRoute.ts'
import { deleteUserByTokenRoute } from './deleteUserByTokenRoute.ts'
import { getUserContextRoute } from './getUserContextRoute.ts'
import { getUserProfileRoute } from './getUserProfileRoute.ts'
import { loginUserRoute } from './loginUserRoute.ts'
import { logoutUserRoute } from './logoutUserRoute.ts'
import { updateUserRoute } from './updateUserRoute.ts'

// biome-ignore lint/suspicious/useAwait: it not necessary
export async function userRoutes(app: FastifyInstance) {
  // ROTAS PÚBLICAS
  app.register(createUserRoute)
  app.register(loginUserRoute)

  // ROTAS COM AUTENTICAÇÃO NECESSÁRIA
  app.register(createUserContextRoute)
  app.register(getUserProfileRoute)
  app.register(getUserContextRoute)
  app.register(updateUserRoute)
  app.register(logoutUserRoute)
  app.register(deleteUserByTokenRoute)
}
