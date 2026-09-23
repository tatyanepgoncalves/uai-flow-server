import { relations } from 'drizzle-orm'
import { authTokens } from './authTokens.ts'
import { chunks } from './chunks.ts'
import { languages } from './languages.ts'
import { userChunkProgress } from './userChunkProgress.ts'
import { userContexts } from './userContexts.ts'
import { userSentences } from './userSentences.ts'
import { userStats } from './userStats.ts'
import { users } from './users.ts'

// Relacionamentos do Usuário
export const usersRelations = relations(users, ({ one, many }) => ({
  tokens: many(authTokens),
  context: many(userContexts),
  createdChunks: many(chunks),
  chunkProgresses: many(userChunkProgress),
  sentences: many(userSentences),
  stats: one(userStats),
}))

// Relacionamente de auth token
export const authTokensRelations = relations(authTokens, ({ one }) => ({
  // Relacionamento N:1 -> Token de autenticação pertence a um usuário
  user: one(users, {
    fields: [authTokens.userId],
    references: [users.id],
  }),
}))

// Relacionamento de idiomas
export const languagesRelations = relations(languages, ({ many }) => ({
  // Relacionamento 1:N -> Um idioma possui vários chunks associados
  chunks: many(chunks),
  // Relacionamento 1:N -> Um idioma possui vários contextos associados
  userContexts: many(userContexts),
}))

export const userContextsRelations = relations(userContexts, ({ one }) => ({
  user: one(users, {
    fields: [userContexts.userId],
    references: [users.id],
  }),
  language: one(languages, {
    fields: [userContexts.languageId],
    references: [languages.id],
  }),
}))

export const chunksRelations = relations(chunks, ({ one, many }) => ({
  language: one(languages, {
    fields: [chunks.languageId],
    references: [languages.id],
  }),
  createdByAiForUser: one(users, {
    fields: [chunks.createdByAiForUserId],
    references: [users.id],
  }),
  userProgresses: many(userChunkProgress),
  userSentences: many(userSentences),
}))

export const userChunkProgressRelations = relations(
  userChunkProgress,
  ({ one }) => ({
    user: one(users, {
      fields: [userChunkProgress.userId],
      references: [users.id],
    }),
    chunk: one(chunks, {
      fields: [userChunkProgress.chunkId],
      references: [chunks.id],
    }),
  })
)

export const userSentencesRelations = relations(userSentences, ({ one }) => ({
  user: one(users, {
    fields: [userSentences.userId],
    references: [users.id],
  }),
  chunk: one(chunks, {
    fields: [userSentences.chunkId],
    references: [chunks.id],
  }),
}))

export const userStatsRelations = relations(userStats, ({ one }) => ({
  user: one(users, {
    fields: [userStats.userId],
    references: [users.id],
  }),
}))
