import { z } from 'zod'

export const updateLanguageSchema = {
  tags: ['Idiomas'],
  description: 'Endpoint de atualização de informações de idioma.',
  summary: 'Atualiza informações de idioma.',
  security: [{ bearerAuth: [] }],
  params: z.object({
    slug: z.string(),
  }),
  body: z.object({
    name: z.string().optional(),
    code: z.string().optional(),
  }),
  response: {
    200: z.object({
      message: z.string(),
      language: z.object({
        id: z.string().uuid(),
        name: z.string(),
        code: z.string(),
        slug: z.string(),
        updatedAt: z.string(),
      }),
    }),
    400: z.object({
      message: z.string(),
    }),
    404: z.object({
      message: z.string(),
    }),
    409: z.object({
      message: z.string(),
    }),
    500: z.object({
      message: z.string(),
    }),
  },
}

export type UpdateLanguageBody = z.infer<typeof updateLanguageSchema.body>
export type UpdateLanguageParams = z.infer<typeof updateLanguageSchema.params>
