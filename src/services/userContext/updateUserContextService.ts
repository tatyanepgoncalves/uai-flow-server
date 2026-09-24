import { eq } from 'drizzle-orm'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'
import type { UpdateUserContextBody } from '../../http/schemas/userContext/updateUserContextSchema.ts'
import { UserNotFoundError } from '../users/errors.ts'
import { UserContextNotFoundError } from './error.ts'

export class UpdateUserContextService {
  async execute(userId: string, data: UpdateUserContextBody) {
    // Verifica se o usuário existe
    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, userId),
    })

    if (!user) {
      throw new UserNotFoundError()
    }

    // Busca o contexto existente
    const existingContext = await db.query.userContexts.findFirst({
      where: eq(schema.userContexts.userId, userId),
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
            : data.difficultyNotes,
        interests:
          data.interests === undefined
            ? existingContext.interests
            : data.interests,
        isActive:
          data.isActive === undefined
            ? existingContext.isActive
            : data.isActive,
        learningGoals:
          data.learningGoals === undefined
            ? existingContext.learningGoals
            : data.learningGoals,
        updatedAt: new Date(),
      })
      .where(eq(schema.userContexts.id, existingContext.id))
      .returning()

    return {
      context: updatedContext,
      message: `Contexto do ${data.user?.name} para o idioma ${data.language.name} atualizado com sucesso.`,
    }
  }
}
