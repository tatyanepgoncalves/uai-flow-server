import React from 'react'
import { schema } from '../../../db/schema/index.ts'
import z from 'zod'

export const createLanguageSchema = {
  tags: ['Idiomas'],
  description: "Adicionar novo idioma no sistema",
  summary: 'Adicionar Idioma',
  body: z.object({
    
  })
}
