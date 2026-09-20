import { z } from 'zod'

export const currentLevelEnum = z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])

export const createUserContextSchema = {
  tags: ['Usuários'],
  summary: 'Cria ou atualiza o contexto de estudo do usuário autenticado.',
  description:
    'Endpoint para definir o nível CEFR, profissão, interesses, metas de aprendizado e dificuldades do usuário.',
  body: z.object({
    currentLevel: currentLevelEnum.default('A1'),
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

export type CreateUserContextInput = z.infer<
  typeof createUserContextSchema.body
>
