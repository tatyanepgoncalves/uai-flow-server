import { eq } from 'drizzle-orm'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'
import type { UpdateUserContextInput } from '../../http/schemas/users/updateUserContextSchema.ts'
import { UserContextNotFoundError, UserNotFoundError } from './errors.ts'

export class UpdateUserContextService {
  async execute(userId: string, data: UpdateUserContextInput) {
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
        learningGoals:
          data.learningGoals === undefined
            ? existingContext.learningGoals
            : data.learningGoals,
        professionOrField:
          data.professionOrField === undefined
            ? existingContext.professionOrField
            : data.professionOrField,
        updatedAt: new Date(),
      })
      .where(eq(schema.userContexts.id, existingContext.id))
      .returning()

    return {
      context: updatedContext,
      message: 'Contexto do usuário atualizado com sucesso.',
    }
  }
}
