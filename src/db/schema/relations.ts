import { relations } from 'drizzle-orm'
import { authTokens } from './authTokens.ts'
import { chunks } from './chunks.ts'
import { languages } from './languages.ts'
import { userCompetencies } from './user_competencies.ts'
import { userContexts } from './userContexts.ts'
import { userDailyChunks } from './userDailyChunks.ts'
import { userLanguages } from './userLanguages.ts'
import { userSentences } from './userSentences.ts'
import { userStats } from './userStats.ts'
import { users } from './users.ts'

// Relacionamentos do Usuário
export const usersRelations = relations(users, ({ one, many }) => ({
  // Relacionamento 1:1 -> Usuário possui um único contexto de aprendizagem/interesses
  context: one(userContexts, {
    fields: [users.id],
    references: [userContexts.userId],
  }),

  // Relacionamento 1:1 -> Usuário possui uma estatística própria de aprendizagem
  stats: one(userStats, {
    fields: [users.id],
    references: [userStats.userId],
  }),

  // Relacionamento 1:N -> Usuário possui vários idiomas configurados
  userLanguages: many(userLanguages),
  // Relacionamento 1:N -> Usuário possui histórico de chunks diários atribuídos
  dailyChunks: many(userDailyChunks),
  // Relacionamento 1:N -> Usuário possui várias frases criadas/submetidas
  sentences: many(userSentences),
  // Relacionamento 1:N -> Chunks gerados exclusivamente pela IA para este usuário
  aiGeneratedChunks: many(chunks, { relationName: 'aiGeneratedForUser' }),
  // Relacionamento 1:N -> Usuário possui vários tokens de autenticação
  tokens: many(authTokens),
  competencies: many(userCompetencies),
}))

export const userStatsRelations = relations(userStats, ({ one }) => ({
  user: one(users, {
    fields: [userStats.userId],
    references: [users.id],
  }),
}))

export const userCompetenciesRelations = relations(
  userCompetencies,
  ({ one }) => ({
    user: one(users, {
      fields: [userCompetencies.userId],
      references: [users.id],
    }),
  })
)

// Relacionamente de auth token
export const authTokensRelations = relations(authTokens, ({ one }) => ({
  // Relacionamento N:1 -> Token de autenticação pertence a um usuário
  usuario: one(users, {
    fields: [authTokens.userId],
    references: [users.id],
  }),
}))

// Relacionamentos do Contexto do Usuário (1:1 com Users)
export const userContextsRelations = relations(userContexts, ({ one }) => ({
  user: one(users, {
    fields: [userContexts.userId],
    references: [users.id],
  }),
}))

// Relacionamentos do Idioma
export const languagesRelations = relations(languages, ({ many }) => ({
  // Relacionamento 1:N -> Um idioma possui vários chunks associados
  chunks: many(chunks),
  // Relacionamento 1:N -> Um idioma está associado a múltiplos usuários via tabela pivot
  userLanguages: many(userLanguages),
}))

// Relacionamentos da Tabela Pivot User <-> Language
export const userLanguagesRelations = relations(userLanguages, ({ one }) => ({
  user: one(users, {
    fields: [userLanguages.userId],
    references: [users.id],
  }),
  language: one(languages, {
    fields: [userLanguages.languageId],
    references: [languages.id],
  }),
}))

// Relacionamentos do Chunk
export const chunksRelations = relations(chunks, ({ one, many }) => ({
  // Relacionamento N:1 -> Chunk pertence a um idioma
  language: one(languages, {
    fields: [chunks.languageId],
    references: [languages.id],
  }),
  // Relacionamento N:1 (Opcional) -> Chunk pode ter sido gerado para um usuário específico pela IA
  createdForUser: one(users, {
    fields: [chunks.createdByAiForUserId],
    references: [users.id],
    relationName: 'aiGeneratedForUser',
  }),
  // Relacionamento 1:N -> Chunk pode estar presente no histórico diário de vários usuários
  dailyAssignments: many(userDailyChunks),
  // Relacionamento 1:N -> Chunk possui várias frases geradas pelos usuários
  userSentences: many(userSentences),
}))

// Relacionamentos dos Chunks Diários (UserDailyChunks)
export const userDailyChunksRelations = relations(
  userDailyChunks,
  ({ one }) => ({
    user: one(users, {
      fields: [userDailyChunks.userId],
      references: [users.id],
    }),
    chunk: one(chunks, {
      fields: [userDailyChunks.chunkId],
      references: [chunks.id],
    }),
  })
)

// Relacionamentos das Frases Criadas (UserSentences)
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
