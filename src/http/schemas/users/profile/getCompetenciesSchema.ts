import { z } from 'zod'

export const getCompetenciesSchema = {
  tags: ['Usuários'],
  summary:
    'Busca informações de competências do perfil do usuário autenticado.',
  description:
    'Endpoint para buscar as competências do perfil do usuário autenticado.',
  response: {
    200: z.object({
      targetGoal: z.string(), // ex: "Goal: CEFR B2 Tech"
      overallDescription: z.string(), // Texto explicativo abaixo do título
      competencies: z.array(
        z.object({
          id: z.string().uuid(),
          title: z.string(),
          level: z.string(),
          percentage: z.number().min(0).max(100),
          tier: z.string(),
          clusters: z.string(),
        })
      ),
    }),
    404: z.object({
      message: z.string(),
    }),
    500: z.object({
      message: z.string(),
    }),
  },
}

export type GetCompetenciesSchema = z.infer<typeof getCompetenciesSchema>
