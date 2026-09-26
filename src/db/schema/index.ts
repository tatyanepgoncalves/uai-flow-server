import { authTokens } from './authTokens.ts'
import { chunks } from './chunks.ts'
import { languages } from './languages.ts'
import {
  authTokensRelations,
  chunksRelations,
  languagesRelations,
  userChunkProgressRelations,
  userContextsRelations,
  userSentencesRelations,
  userStatsRelations,
  usersRelations,
} from './relations.ts'
import { userChunkProgress } from './userChunkProgress.ts'
import { userContexts } from './userContexts.ts'

import { userSentences } from './userSentences.ts'
import { userStats } from './userStats.ts'
import { users } from './users.ts'

export const schema = {
  users,
  authTokens,
  chunks,
  languages,

  userSentences,
  userContexts,
  userStats,

  userChunkProgress,

  usersRelations,
  authTokensRelations,

  languagesRelations,
  userContextsRelations,
  chunksRelations,
  userChunkProgressRelations,
  userSentencesRelations,
  userStatsRelations,
}
