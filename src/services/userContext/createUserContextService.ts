import { and, eq } from 'drizzle-orm'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'
import type {
  CreateUserContextBody,
  CreateUserContextQuery,
} from '../../http/schemas/userContext/createUserContextSchema.ts'
import { formatField, formatRelativeTime } from '../../lib/utils.ts'
import { LanguageNotFoundError } from '../languages/error.ts'
import { UserNotFoundError } from '../users/errors.ts'
import { UserContextAlreadyExistForThisLanguageError } from './error.ts'

export class CreateUserContextService {
  async execute(
    userId: string,
    data: CreateUserContextBody,
    { languageId, languageSlug }: CreateUserContextQuery
  ) {
    // Busca o usuário pelo ID do token
    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, userId),
    })

    if (!user) {
      throw new UserNotFoundError()
    }

    // Busca o idioma informado no body
    const language = await db.query.languages.findFirst({
      where: and(
        languageId ? eq(schema.languages.id, languageId) : undefined,
        languageSlug ? eq(schema.languages.slug, languageSlug) : undefined
      ),
    })

    if (!language) {
      throw new LanguageNotFoundError()
    }

    // Verifica se o usuário já possui um contexto ativo/cadastrado para este idioma
    const existingContext = await db.query.userContexts.findFirst({
      where: and(
        eq(schema.userContexts.userId, userId),
        eq(schema.userContexts.languageId, language.id)
      ),
    })

    if (existingContext) {
      throw new UserContextAlreadyExistForThisLanguageError()
    }

    // Cria o novo contexto convertendo os arrays para string
    const [newContext] = await db
      .insert(schema.userContexts)
      .values({
        currentLevel: data.currentLevel ?? 'A1',
        dailyGoalChunks: data.dailyGoalChunks,
        difficultyNotes: formatField(data.difficultyNotes),
        interests: formatField(data.interests),
        isActive: data.isActive ?? true,
        languageId: language.id,
        learningGoals: formatField(data.learningGoals),
        userId,
      })
      .returning()

    return {
      context: {
        createdAt: newContext.createdAt
          ? formatRelativeTime(newContext.createdAt)
          : newContext.createdAt,
        currentLevel: newContext.currentLevel,
        dailyGoalChunks: newContext.dailyGoalChunks,
        difficultyNotes: newContext.difficultyNotes,
        id: newContext.id,
        interests: newContext.interests,
        isActive: newContext.isActive ?? true,
        language: {
          id: language.id,
          name: language.name,
        },
        learningGoals: newContext.learningGoals,
        user: {
          id: user.id,
          name: user.name,
        },
      },
      message: `Contexto do usuário ${user.name} para o idioma ${language.name} criado com sucesso!`,
    }
  }
}
