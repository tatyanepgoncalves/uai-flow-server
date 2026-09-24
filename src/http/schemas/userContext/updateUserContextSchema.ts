import { z } from 'zod'

export const updateUserContextSchema = {
  tags: ['Contexto do Usuário'],
  summary: 'Atualiza parcialmente o contexto de estudo do usuário autenticado.',
  description:
    'Endpoint para atualizar o nível CEFR, meta diária de chunks, interesses, anotações de dificuldade, dificuldades, ativar/desativar para um idioma específico.',
  body: z.object({
    currentLevel: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']).optional(),
    dailyGoalChunks: z.number().int().min(1).max(20).optional(),
    isActive: z.boolean().optional(),
    interests: z.string().trim().nullable().optional(),
    learningGoals: z.string().trim().nullable().optional(),
    difficultyNotes: z.string().trim().nullable().optional(),
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
