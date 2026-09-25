import z from 'zod'

export const deleteLanguageSchema = {
  tags: ['Idiomas'],
  summary: 'Excluir um idioma',
  description: 'Endpoint para excluir permanentemente um idioma do sistema.',
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

export type DeleteLanguageQuery = z.infer<
  typeof deleteLanguageSchema.querystring
>