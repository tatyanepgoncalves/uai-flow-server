import { z } from 'zod'

export const createLanguageSchema = {
  tags: ['Idiomas'],
  summary: 'Adiciona um novo idioma ao perfil do usuário. ',
  description: 'Endpoint para adicionar um novo idioma ao perfil do usuário.',
  security: [{ BearerAuth: [] }],
  body: z.object({
    name: z.string().min(2).max(100),
    code: z.string().min(2).max(10),
  }),
  response: {
    200: z.object({
      message: z.string(),
      language: z.object({
        id: z.string().uuid(),
        name: z.string().min(2).max(100),
        code: z.string().min(2).max(10),
        createdAt: z.string(),
      }),
    }),
    400: z.object({
      message: z.string(),
    }),
    404: z.object({
      message: z.string(),
    }),
    500: z.object({
      message: z.string(),
    }),
  },
}

export type CreateLanguageSchema = z.infer<typeof createLanguageSchema.body>
