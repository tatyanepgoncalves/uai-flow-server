import { z } from 'zod'

export const createUserSchema = {
  tags: ['Usuários'],
  summary: 'Cadastra um novo usuário',
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    professionArea: z.string().min(2),
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
        professionArea: z.string(),
        createdAt: z.string(),
      }),
    }),
    409: z.object({ message: z.string() }),
    500: z.object({ message: z.string() }),
  },
}

export type CreateUserSchema = z.infer<typeof createUserSchema.body>
