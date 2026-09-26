import { and, eq } from 'drizzle-orm'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'
import type {
  UpdateUserContextBody,
  UpdateUserContextQuery,
} from '../../http/schemas/userContext/updateUserContextSchema.ts'
import { formatField, formatRelativeTime } from '../../lib/utils.ts'
import { LanguageNotFoundError } from '../languages/error.ts'
import { UserNotFoundError } from '../users/errors.ts'
import { UserContextNotFoundError } from './error.ts'

export class UpdateUserContextService {
  async execute(
    userId: string,
    data: UpdateUserContextBody,
    { slug, id }: UpdateUserContextQuery
  ) {
    // Verifica se o usuário existe
    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, userId),
    })

    if (!user) {
      throw new UserNotFoundError()
    }

    // Busca idioma
    const language = await db.query.languages.findFirst({
      where: and(
        id ? eq(schema.languages.id, id) : undefined,
        slug ? eq(schema.languages.slug, slug) : undefined
      ),
    })

    if (!language) {
      throw new LanguageNotFoundError()
    }

    // Busca o contexto existente
    const existingContext = await db.query.userContexts.findFirst({
      where: and(
        eq(schema.userContexts.userId, userId),
        eq(schema.userContexts.languageId, language.id)
      ),
    })

    if (!existingContext) {
      throw new UserContextNotFoundError()
    }

    // Atualiza somente os campos fornecidos no payload
    const [updatedContext] = await db
      .update(schema.userContexts)
      .set({
        currentLevel: data.currentLevel ?? existingContext.currentLevel,
        dailyGoalChunks:
          data.dailyGoalChunks ?? existingContext.dailyGoalChunks,
        difficultyNotes:
          data.difficultyNotes === undefined
            ? existingContext.difficultyNotes
            : formatField(data.difficultyNotes),
        interests:
          data.interests === undefined
            ? existingContext.interests
            : formatField(data.interests),
        isActive:
          data.isActive === undefined
            ? existingContext.isActive
            : data.isActive,
        learningGoals:
          data.learningGoals === undefined
            ? existingContext.learningGoals
            : formatField(data.learningGoals),
        updatedAt: new Date(),
      })
      .where(eq(schema.userContexts.id, existingContext.id))
      .returning()

    const formattedResponse = {
      currentLevel: updatedContext.currentLevel,
      dailyGoalChunks: updatedContext.dailyGoalChunks,
      difficultyNotes: updatedContext.difficultyNotes,
      id: updatedContext.id,
      interests: updatedContext.interests,
      isActive: updatedContext.isActive ?? true,
      language: {
        id: language.id,
        name: language.name,
      },
      learningGoals: updatedContext.learningGoals,
      updatedAt: updatedContext.updatedAt
        ? formatRelativeTime(updatedContext.updatedAt)
        : updatedContext.updatedAt,
      user: {
        id: user.id,
        name: user.name,
      },
    }

    return {
      context: formattedResponse,
      message: `Contexto do ${user.name} para o idioma ${language.name} atualizado com sucesso.`,
    }
  }
}
