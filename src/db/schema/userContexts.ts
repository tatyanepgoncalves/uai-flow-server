import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { currentLevelCEFREnum } from './enum.ts'
import { users } from './users.ts'

// CONTEXTO DO USUÁRIO PARA A IA (NOVO!)
// Guarda os interesses e o nível para o prompt da LLM
export const userContexts = pgTable('user_contexts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  currentLevel: currentLevelCEFREnum('current_level').default('A1').notNull(), // A1, A2, B1, B2, C1, C2
  professionOrField: text('profession_or_field'), // ex: "Desenvolvedor de Software", "Design"
  interests: text('interests'), // ex: "Tecnologia, Séries de TV, Viagens, Negócios"
  learningGoals: text('learning_goals'), // ex: "Melhorar vocabulário para reuniões e code review"
  difficultyNotes: text('difficulty_notes'), // ex: "Tenho dificuldade com Phrasal Verbs de movimento"

  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})
