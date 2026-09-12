import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { chunks } from './chunks.ts'
import { users } from './users.ts'

export const userSentences = pgTable('user_sentences', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  chunkId: uuid('chunk_id').references(() => chunks.id),
  userInput: text('user_input'),
  aiFeedback: text('ai_feedback'),
  aiScore: integer('ai_score'), // Note 0 a 10
  nativeSuggestion: text('native_suggestion'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})
