import { authTokens } from './authTokens.ts'
import { chunks } from './chunks.ts'
import { languages } from './languages.ts'
import { authTokensRelations, chunksRelations, languagesRelations, userContextsRelations, userDailyChunksRelations, userLanguagesRelations, userSentencesRelations, usersRelations } from './relations.ts'
import { userContexts } from './userContexts.ts'
import { userDailyChunks } from './userDailyChunks.ts'
import { userLanguages } from './userLanguages.ts'
import { userSentences } from './userSentences.ts'
import { users } from './users.ts'

export const schema = {
  users,
  authTokens,
  chunks,
  languages,
  userDailyChunks,
  userLanguages,
  userSentences,
  userContexts,


  usersRelations,
  authTokensRelations,
  userContextsRelations,
  languagesRelations,
  userLanguagesRelations,
  userDailyChunksRelations,
  userSentencesRelations,
  chunksRelations
}
