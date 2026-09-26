import { z } from 'zod'

export const createUserContextSchema = {
  tags: ['Contexto do Usuário'],
  summary: 'Cria o contexto de estudo do usuário autenticado.',
  description:
    'Endpoint para definir o nível CEFR, interesses, metas de aprendizado e dificuldades do usuário para um idioma específico.',
  querystring: z
    .object({
      languageId: z.string().uuid().optional(),
      languageSlug: z.string().optional(),
    })
    .refine((data) => data.languageId || data.languageSlug, {
      message: 'É necessário fornecer ao menos o ID ou o Slug do idioma.',
      path: ['languageId'],
    }),
  body: z.object({
    isActive: z.boolean().default(true),
    currentLevel: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']).default('A1'),
    interests: z
      .union([z.string(), z.array(z.string())])
      .nullable()
      .optional(),
    dailyGoalChunks: z.number().int().min(1).max(100).default(3),
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
        isActive: z.boolean().optional(),
        currentLevel: z.string(),
        interests: z.union([z.string(), z.array(z.string())]).nullable(),
        dailyGoalChunks: z.number(),
        learningGoals: z.union([z.string(), z.array(z.string())]).nullable(),
        difficultyNotes: z.union([z.string(), z.array(z.string())]).nullable(),
        createdAt: z.string(),
      }),
    }),
    400: z.object({
      message: z.string(),
    }),
    401: z.object({
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

export type CreateUserContextBody = z.infer<typeof createUserContextSchema.body>
export type CreateUserContextQuery = z.infer<
  typeof createUserContextSchema.querystring
>
