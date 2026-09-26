import { z } from 'zod'

export const updateUserContextSchema = {
  tags: ['Contexto do Usuário'],
  summary: 'Atualiza parcialmente o contexto de estudo do usuário autenticado.',
  description:
    'Endpoint para atualizar o nível CEFR, meta diária de chunks, interesses, anotações de dificuldade, dificuldades, ativar/desativar para um idioma específico.',
  querystring: z
    .object({
      id: z.string().uuid().optional(),
      slug: z.string().optional(),
    })
    .refine((data) => data.id || data.slug, {
      message: 'É necessário fornecer ao menos o ID ou o Slug do idioma.',
      path: ['id'],
    }),
  body: z.object({
    currentLevel: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']).optional(),
    dailyGoalChunks: z.number().int().min(1).max(20).optional(),
    isActive: z.boolean().optional(),
    interests: z
      .union([z.string(), z.array(z.string())])
      .nullable()
      .optional(),
    learningGoals: z
      .union([z.string(), z.array(z.string())])
      .nullable()
      .optional(),
    difficultyNotes: z
      .union([z.string(), z.array(z.string())])
      .nullable()
      .optional(),
  }),
  response: {
    200: z.object({
      message: z.string(),
      context: z.object({
        id: z.string().uuid(),
        user: z.object({
          id: z.string().uuid(),
          name: z.string(),
        }),
        language: z.object({
          id: z.string().uuid(),
          name: z.string(),
        }),
        currentLevel: z.string(),
        dailyGoalChunks: z.number(),
        isActive: z.boolean(),
        interests: z.string().nullable(),
        learningGoals: z.string().nullable(),
        difficultyNotes: z.string().nullable(),
        updatedAt: z.string(),
      }),
    }),
    404: z.object({
      message: z.string(),
    }),
    500: z.object({
      message: z.string(),
    }),
  },
}

export type UpdateUserContextBody = z.infer<typeof updateUserContextSchema.body>
export type UpdateUserContextQuery = z.infer<
  typeof updateUserContextSchema.querystring
>
