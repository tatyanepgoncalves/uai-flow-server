import { z } from 'zod'

export const currentLevelEnum = z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])

export const updateUserContextSchema = {
  tags: ['Usuários'],
  summary: 'Atualiza parcialmente o contexto de estudo do usuário autenticado.',
  description:
    'Endpoint para atualizar o nível CEFR, meta diária de chunks, profissão, interesses, metas ou anotações de dificuldade.',
  body: z.object({
    currentLevel: currentLevelEnum.optional(),
    dailyGoalChunks: z.number().int().min(1).max(20).optional(),
    professionOrField: z.string().trim().nullable().optional(),
    interests: z.string().trim().nullable().optional(),
    learningGoals: z.string().trim().nullable().optional(),
    difficultyNotes: z.string().trim().nullable().optional(),
  }),
  response: {
    200: z.object({
      message: z.string(),
      context: z.object({
        id: z.string().uuid(),
        userId: z.string().uuid(),
        currentLevel: currentLevelEnum,
        dailyGoalChunks: z.number(),
        professionOrField: z.string().nullable(),
        interests: z.string().nullable(),
        learningGoals: z.string().nullable(),
        difficultyNotes: z.string().nullable(),
        createdAt: z.date().or(z.string()),
        updatedAt: z.date().or(z.string()),
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

export type UpdateUserContextInput = z.infer<
  typeof updateUserContextSchema.body
>
