import { integer, pgTable, real, timestamp, uuid } from 'drizzle-orm/pg-core'
import { users } from './users.ts'

export const userStats = pgTable('user_stats', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),

  // Chunks
  chunksMastered: integer('chunks_mastered').notNull().default(0),
  chunksThisWeek: integer('chunks_this_week').notNull().default(0),

  // Streak
  currentStreakDays: integer('current_streak_days').notNull().default(0),
  streakRecordDays: integer('streak_record_days').notNull().default(0),

  // Recall Accuracy (SRS SM-2)
  recallAccuracyPercentage: real('recall_accuracy_percentage')
    .notNull()
    .default(0.0),

  // Immersion Time
  totalImmersionMinutes: integer('total_immersion_minutes')
    .notNull()
    .default(0),
  dailyAvgImmersionMinutes: integer('daily_avg_immersion_minutes')
    .notNull()
    .default(0),

  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
