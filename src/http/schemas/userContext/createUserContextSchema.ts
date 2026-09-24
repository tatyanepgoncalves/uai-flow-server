import { z } from 'zod'

export const createUserContextSchema = {
  tags: ['Contexto do Usuário'],
  summary: 'Cria o contexto de estudo do usuário autenticado.',
  description:
    'Endpoint para definir o nível CEFR, interesses, metas de aprendizado e dificuldades do usuário para um idioma específico.',
  body: z.object({
    isActive: z.boolean().default(true),
    currentLevel: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']).default('A1'),
    interests: z.string().nullable().optional(),
    dailyGoalChunks: z.number().int().min(1).max(100).default(3),
    learningGoals: z.string().nullable().optional(),
    difficultyNotes: z.string().nullable().optional(),
    language: z.object({
      id: z.string().uuid(),
      name: z.string(),
    }),
    user: z
      .object({
        id: z.string().uuid(),
        name: z.string(),
      })
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
        isActive: z.boolean(),
        currentLevel: z.string(),
        interests: z.string().nullable(),
        dailyGoalChunks: z.number(),
        learningGoals: z.string().nullable(),
        difficultyNotes: z.string().nullable(),
        createdAt: z.string(),
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

export type CreateUserContextBody = z.infer<typeof createUserContextSchema.body>
