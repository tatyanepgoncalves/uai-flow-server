import {
  boolean,
  index,
  integer,
  pgTable,
  real,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'
import { chunks } from './chunks.ts'
import { users } from './users.ts'

export const userChunkProgress = pgTable(
  'user_chunk_progress',
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    chunkId: uuid('chunk_id')
      .notNull()
      .references(() => chunks.id, { onDelete: 'cascade' }),
    easeFactor: real('ease_factor').default(2.5).notNull(),
    intervalDays: integer('interval_days').default(0).notNull(),
    repetitions: integer('repetitions').default(0).notNull(),
    nextReviewAt: timestamp('next_review_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    lastReviewedAt: timestamp('last_reviewed_at', { withTimezone: true }),
    isCompletedToday: boolean('is_completed_today').default(false).notNull(),
  },
  (table) => [
    uniqueIndex('user_chunk_progress_user_chunk_unique').on(
      table.userId,
      table.chunkId
    ),
    // Índice para otimizar as queries diárias de revisão do SRS
    index('user_chunk_progress_next_review_idx').on(
      table.userId,
      table.nextReviewAt
    ),
  ]
)
