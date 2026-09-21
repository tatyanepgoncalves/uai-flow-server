import { authTokens } from './authTokens.ts'
import { chunks } from './chunks.ts'
import { languages } from './languages.ts'
import {
  authTokensRelations,
  chunksRelations,
  languagesRelations,
  userCompetenciesRelations,
  userContextsRelations,
  userDailyChunksRelations,
  userLanguagesRelations,
  userSentencesRelations,
  userStatsRelations,
  usersRelations,
} from './relations.ts'
import { userCompetencies } from './userCompetencies.ts'
import { userContexts } from './userContexts.ts'
import { userDailyChunks } from './userDailyChunks.ts'
import { userLanguages } from './userLanguages.ts'
import { userSentences } from './userSentences.ts'
import { userStats } from './userStats.ts'
import { users } from './users.ts'
import { userWeeklyGoals } from './userWeeklyGoals.ts'

export const schema = {
  users,
  authTokens,
  chunks,
  languages,
  userDailyChunks,
  userLanguages,
  userSentences,
  userContexts,
  userStats,
  userCompetencies,
  userWeeklyGoals,

  usersRelations,
  authTokensRelations,
  userContextsRelations,
  languagesRelations,
  userLanguagesRelations,
  userDailyChunksRelations,
  userSentencesRelations,
  chunksRelations,
  userStatsRelations,
  userCompetenciesRelations,
}
