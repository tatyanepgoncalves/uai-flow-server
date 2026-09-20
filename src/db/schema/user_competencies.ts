import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { currentLevelCEFREnum } from './enum.ts'
import { users } from './users.ts'

export const userCompetencies = pgTable('user_competencies', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  title: text('title').notNull(), // ex: "Vocabulário Técnico (DevOps & Cloud Architecture)"
  level: currentLevelCEFREnum('level').notNull().default('A1'), // ex: B2
  levelLabel: text('level_label'), // ex: "B1+" para variações intermédias
  percentage: integer('percentage').notNull().default(0), // ex: 82
  tier: text('tier').notNull(), // ex: "Proficiente" | "Avançado Operacional"
  clusters: text('clusters').notNull(), // ex: "Terraform, Kubernetes Ingress, Pod Lifecycle"

  order: integer('order').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
})
