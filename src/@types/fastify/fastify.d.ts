import 'fastify'

declare module 'fastify' {
  export interface FastifyRequest {
    file?: string
    user: {
      id: string
      nome: string
      email: string
      sub: string
    }
  }
}
