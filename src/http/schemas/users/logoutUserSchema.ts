import { z } from 'zod'

export const logoutUserSchema = {
  tags: ['Usuários'],
  summary: 'Realiza o logout do usuário autenticado',
  description: 'Realiza o logout do usuário autenticado',
  response: {
    200: z.object({
      message: z.string(),
      userId: z.string(),
    }),
    404: z.object({
      message: z.string(),
    }),
    500: z.object({
      message: z.string(),
    }),
  },
  security: [{ bearerAuth: [] }],
}
