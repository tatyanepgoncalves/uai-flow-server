import { z } from 'zod'

export const updateUserSchema = {
  tags: ['Usuários'],
  summary: 'Atualiza informações do usuário.',
  description: 'Atualiza as informações do usuário autenticado.',
  security: [{ bearerAuth: [] }],
  body: z.object({
    email: z.string().email().optional(),
    avatarUrl: z.string().url().nullable().optional(),
    name: z.string().min(3).optional(),
    password: z.string().min(8).optional(),
  }),
  response: {
    200: z.object({
      message: z.string().optional(),
      user: z.object({
        email: z.string(),
        id: z.string().uuid(),
        avatarUrl: z.string().nullable(),
        name: z.string(),
        updatedAt: z.string().nullable(),
      }),
    }),
    400: z.object({ message: z.string() }),
    401: z.object({ message: z.string() }),
    403: z.object({ message: z.string() }),
    404: z.object({ message: z.string() }),
    409: z.object({ message: z.string() }),
    500: z.object({ message: z.string() }),
  },
}

export type UpdateUserBodySchema = z.infer<typeof updateUserSchema.body>
