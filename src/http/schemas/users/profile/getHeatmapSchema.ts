import { z } from 'zod'

export const getActivityHeatmapSchema = {
  tags: ['Usuários'],
  summary: 'Busca histórico diário do perfil do usuário autenticado.',
  description:
    'Endpoint para buscar o histórico diário do perfil do usuário autenticado.',
  querystring: z.object({
    days: z.coerce.number().int().positive().default(30),
  }),
  response: {
    200: z.object({
      activeDaysPercentage: z.number(), // Ex: 98% de dias ativos no mês atual
      totalActiveDays: z.number().int(),
      startDate: z.string(), // ISO String da data inicial (ex: 90 dias atrás)
      endDate: z.string(), // ISO String de hoje
      activities: z.array(
        z.object({
          date: z.string(), // Formato YYYY-MM-DD
          count: z.number().int(), // Quantidade de chunks/atividades finalizadas
          level: z.number().int().min(0).max(4), // Intensidade de cor do heatmap (0 a 4)
        })
      ),
    }),
    401: z.object({
      message: z.string(),
    }),
    404: z.object({
      message: z.string(),
    }),
    500: z.object({
      message: z.string(),
    }),
  },
}

export type GetActivityHeatmapSchema = z.infer<
  typeof getActivityHeatmapSchema.querystring
>
