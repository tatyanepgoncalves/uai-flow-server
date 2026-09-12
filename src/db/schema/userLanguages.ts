import { boolean, pgTable, uniqueIndex, uuid } from 'drizzle-orm/pg-core'
import { languages } from './languages.ts'
import { users } from './users.ts'

export const userLanguages = pgTable(
  'user_languages',
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .references(() => users.id)
      .notNull(),
    languageId: uuid('language_id')
      .references(() => languages.id)
      .notNull(),
    isActive: boolean('isActive').default(true),
  },
  (table) => ({
    userLangUnique: uniqueIndex('user_language_unique').on(
      table.userId,
      table.languageId
    ),
  })
)
