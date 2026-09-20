import { z } from 'zod'

export const getUserContextSchema = {
  tags: ['Usuários'],
  summary: 'Busca informações completas do perfil do usuário autenticado.',
  description:
    'Endpoint para buscar o perfil, contextos, métricas de estudo e configurações do usuário autenticado.',
  response: {
    200: z.object({
      message: z.string().optional(),
      user: z.object({
        // Contexto & Nível
        context: z
          .object({
            currentLevel: z.string(),
            professionOrField: z.string().nullable(),
            interests: z.string().nullable(),
            learningGoals: z.string().nullable(),
          })
          .nullable(),

        // Estatísticas Rápidas
        stats: z.object({
          chunksMastered: z.number(),
          chunksMasteredThisWeek: z.number(),
          activeStreakDays: z.number(),
          streakRecordDays: z.number(),
          recallAccuracyPercentage: z.number(),
          immersionTimeHours: z.number(),
        }),

        // Metas Diárias/Semanais
        weeklyGoals: z.object({
          dailyChunksGoal: z.number(),
          dailyChunksCompletedToday: z.number(),
          pronunciationDrillsCompleted: z.number(),
          pronunciationDrillsGoal: z.number(),
          activeListeningMinutes: z.number(),
          activeListeningGoalMinutes: z.number(),
        }),
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
