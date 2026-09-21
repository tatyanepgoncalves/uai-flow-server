import { z } from 'zod'

export const getWeeklyGoalsSchema = {
  tags: ['Usuários'],
  summary: 'Busca metas de semanais do perfil do usuário autenticado.',
  description:
    'Endpoint para buscar as metas de semanais do perfil do usuário autenticado.',
  response: {
    200: z.object({
      weekLabel: z.string(), // ex: "Semana 43"
      dailyChunks: z.object({
        current: z.number().int(),
        target: z.number().int(),
        unit: z.string(), // "hoje"
        subtext: z.string().nullable(),
      }),
      pronunciationDrills: z.object({
        current: z.number().int(),
        target: z.number().int(),
        unit: z.string(), // "sessões"
        nextTopic: z.string().nullable(),
      }),
      activeListening: z.object({
        current: z.number().int(),
        target: z.number().int(),
        unit: z.string(), // "min"
        source: z.string().nullable(),
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

export type GetWeeklyGoalsSchema = z.infer<typeof getWeeklyGoalsSchema>
