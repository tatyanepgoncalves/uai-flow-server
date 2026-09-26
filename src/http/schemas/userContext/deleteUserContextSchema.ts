import { z } from 'zod'

export const deleteUserContextSchema = {
  tags: ['Contexto do Usuário'],
  summary: 'Deleta o contexto de estudo do usuário autenticado.',
  description: 'Endpoint para deletar o contexto do usuário do idioma.',
  response: {
    200: z.object({
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

export type DeleteUserContextSchema = z.infer<typeof deleteUserContextSchema>
