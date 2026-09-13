import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { typeChunkEnum } from './enum.ts'
import { languages } from './languages.ts'
import { users } from './users.ts'

export const chunks = pgTable('chunks', {
  id: uuid('id').primaryKey().defaultRandom(),
  languageId: uuid('language_id')
    .references(() => languages.id)
    .notNull(),
  type: typeChunkEnum('type').notNull(),
  expression: text('expression').notNull(), // The expression or phrase in the target language  ex: 'look forward to'
  meaning: text('meaning').notNull(), // The meaning or translation
  exampleSentence: text('example_sentence').notNull(), // An example sentence using the chunk
  slug: text('slug').unique().notNull(),
  explanationContext: text('explanation_context'), // Dica extra da IA de quando usar
  createdByAiForUserId: uuid('created_by_ai_for_user_id').references(
    () => users.id,
    { onDelete: 'set null' }
  ), // Se NULL, é um chunk global; se tiver ID, foi gerado para esse usuário
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
})
