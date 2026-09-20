import { z } from 'zod'

export const getStatsOverviewSchema = {
  tags: ['Usuários'],
  summary:
    'Busca informações de estatísticas do perfil do usuário autenticado.',
  description:
    'Endpoint para buscar as estatísticas do perfil do usuário autenticado.',
  response: {
    200: z.object({
      chunksMastered: z.object({
        total: z.number().int(),
        thisWeek: z.number().int(),
      }),
      activeStreak: z.object({
        currentDays: z.number().int(),
        recordDays: z.number().int(),
      }),
      recallAccuracy: z.object({
        percentage: z.number(),
        algorithm: z.string().default('SRS SM-2'),
      }),
      immersionTime: z.object({
        totalHours: z.number(),
        dailyAvgMinutes: z.number().int(),
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

export type GetStatsOverview = z.infer<typeof getStatsOverviewSchema>
