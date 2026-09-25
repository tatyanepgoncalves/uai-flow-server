import { z } from 'zod'

export const deleteLanguageTemporarySchema = {
  tags: ['Idiomas'],
  summary: 'Excluir um idioma temporariamente',
  description: 'Endpoint para excluir temporáriamente um idioma do sistema.',
  querystring: z
    .object({
      slug: z.string().optional(),
      id: z.string().uuid().optional(),
    })
    .refine((data) => data.slug || data.id, {
      message: 'É necessário fornecer ao menos o ID ou o Slug do idioma.',
      path: ['id'],
    }),
  response: {
    200: z.object({
      message: z.string(),
    }),
    400: z.object({ message: z.string() }),
    401: z.object({ message: z.string() }),
    403: z.object({ message: z.string() }),
    404: z.object({ message: z.string() }),
    409: z.object({ message: z.string() }),
    500: z.object({ message: z.string() }),
  },
}

export type DeleteLanguageTemporaryQuery = z.infer<
  typeof deleteLanguageTemporarySchema.querystring
>