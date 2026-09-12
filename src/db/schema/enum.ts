import { pgEnum } from 'drizzle-orm/pg-core'

export const typeChunkEnum = pgEnum('type_chunk', [
  'COLLOCATION',
  'IDIOM',
  'PHRASAL VERB',
  'FIXED PHRASE',
])

export const currentLevelCEFREnum = pgEnum('current_level_cefr', [
  'A1',
  'A2',
  'B1',
  'B2',
  'C1',
  'C2',
])
