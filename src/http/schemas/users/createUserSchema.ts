import { z } from 'zod'

export const createUserSchema = {
  tags: ['Usuários'],
  summary: 'Cadastra um novo usuário',
  description: 'Cadastra um novo usuário no UAIFlow.',
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
  }),
  response: {
    201: z.object({
      message: z.string(),
      token: z.string(),
      user: z.object({
        id: z.string().uuid(),
        name: z.string(),
        email: z.string(),
        slug: z.string(),
        createdAt: z.string(),
      }),
    }),
    409: z.object({ message: z.string() }),
    500: z.object({ message: z.string() }),
  },
}

export type CreateUserSchema = z.infer<typeof createUserSchema.body>
