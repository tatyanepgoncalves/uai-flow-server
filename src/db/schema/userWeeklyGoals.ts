import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { users } from './users.ts'

export const userWeeklyGoals = pgTable('user_weekly_goals', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  weekNumber: integer('week_number').notNull(), // ex: 43

  // Meta 1: Chunks Diários
  dailyChunksCurrent: integer('daily_chunks_current').notNull().default(0),
  dailyChunksTarget: integer('daily_chunks_target').notNull().default(20),
  dailyChunksSubtext: text('daily_chunks_subtext'), // ex: "Faltam 5 chunks para o bônus diário"

  // Meta 2: Drills de Pronúncia Tech
  pronunciationDrillsCurrent: integer('pronunciation_drills_current')
    .notNull()
    .default(0),
  pronunciationDrillsTarget: integer('pronunciation_drills_target')
    .notNull()
    .default(5),
  pronunciationNextTopic: text('pronunciation_next_topic'), // ex: "Idempotency & Backoff Strategies"

  // Meta 3: Escuta Ativa (Minutos)
  activeListeningMinutesCurrent: integer('active_listening_minutes_current')
    .notNull()
    .default(0),
  activeListeningMinutesTarget: integer('active_listening_minutes_target')
    .notNull()
    .default(60),
  activeListeningSource: text('active_listening_source'), // ex: "Tech Podcasts & Eng Keynotes"

  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
})
