import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { chunks } from './chunks.ts'
import { users } from './users.ts'

export const userDailyChunks = pgTable(
  'user_daily_chunks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .references(() => users.id)
      .unique()
      .notNull(),
    chunkId: uuid('chunk_id')
      .references(() => chunks.id)
      .unique()
      .notNull(),
    assignedDate: timestamp('assigned_date', { withTimezone: true }), // Date free
    isCompleted: boolean('is_completed').default(false),
    reasonForSelection: text('reason_for_selection'), // ex: "Baseado no seu interesse em tecnologia" ou "Revisão espaçada"
  },
  (table) => ({
    userDateIdx: index('user_daily_chunks_user_date_idx').on(
      table.userId,
      table.assignedDate
    ),
  })
)
