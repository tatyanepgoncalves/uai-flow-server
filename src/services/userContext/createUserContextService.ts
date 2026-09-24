import { and, eq } from 'drizzle-orm'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'
import type { CreateUserContextBody } from '../../http/schemas/userContext/createUserContextSchema.ts'
import { UserNotFoundError } from '../users/errors.ts'
import { UserContextAlreadyExistForThisLanguageError } from './error.ts'

export class CreateUserContextService {
  async execute(userId: string, data: CreateUserContextBody) {
    // Verifica se o usuário existe
    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, userId),
    })

    if (!user) {
      throw new UserNotFoundError()
    }

    // Verifica se o usuário já possui um contexto no idioma
    const existingContext = await db.query.userContexts.findFirst({
      where: and(
        eq(schema.userContexts.userId, userId),
        eq(schema.userContexts.languageId, data.language.id)
      ),
    })

    if (existingContext) {
      throw new UserContextAlreadyExistForThisLanguageError()
    }

    // Cria um novo contexto
    const [newContext] = await db
      .insert(schema.userContexts)
      .values({
        currentLevel: data.currentLevel ?? 'A1',
        dailyGoalChunks: data.dailyGoalChunks ?? 3,
        difficultyNotes: data.difficultyNotes ?? null,
        interests: data.interests ?? null,
        isActive: data.isActive ?? true,
        languageId: data.language.id,
        learningGoals: data.learningGoals ?? null,
        userId,
      })
      .returning()

    return {
      context: newContext,
      message: `Contexto do ${data.user?.name} para o idioma ${data.language.name} criado com sucesso!`,
    }
  }
}
