import { z } from 'zod'

export const updateWeeklyGoalsSchema = {
  tags: ['Metas semanais'],
  summary: 'Atualiza metas de semanais do perfil do usuário autenticado.',
  description:
    'Endpoint para atualizar as metas de semanais do perfil do usuário autenticado.',
  body: z.object({
    dailyChunksTarget: z.number().int().positive().default(20),
    pronunciationDrillsTarget: z.number().int().positive().default(5),
    activeListeningMinutesTarget: z.number().int().positive().default(60),
    pronunciationNextTopic: z.string().optional(),
    activeListeningSource: z.string().optional(),
  }),
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

export type UpdateWeeklyGoalsSchema = z.infer<
  typeof updateWeeklyGoalsSchema.body
>
