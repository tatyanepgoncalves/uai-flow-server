import { integer, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'
import { users } from './users.ts'

export const userStats = pgTable('user_stats', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  chunksMastered: integer('chunks_mastered').default(0).notNull(),
  currentStreakDays: integer('current_streak_days').default(0).notNull(),
  streakRecordDays: integer('streak_record_days').default(0).notNull(),
  totalImmersionMinutes: integer('total_immersion_minutes')
    .default(0)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})
