import type { FastifyInstance } from 'fastify'
import { createUserRoute } from './createUserRoute.ts'
import { logoutUserRoute } from './logoutUserRoute.ts'

// biome-ignore lint/suspicious/useAwait: it not necessary
export async function userRoutes(app: FastifyInstance) {
  app.register(createUserRoute)

  app.register(logoutUserRoute)
}
