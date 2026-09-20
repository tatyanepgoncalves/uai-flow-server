import { eq } from 'drizzle-orm'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'
import type { CreateUserContextInput } from '../../http/schemas/users/createUserContextSchema.ts'
import { UserNotFoundError } from './errors.ts'

export class CreateUserContextService {
  async execute(userId: string, data: CreateUserContextInput) {
    // Verifica se o usuário existe
    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, userId),
    })

    if (!user) {
      throw new UserNotFoundError()
    }

    // Verifica se o usuário já possui um contexto
    const existingContext = await db.query.userContexts.findFirst({
      where: eq(schema.userContexts.userId, userId),
    })

    if (existingContext) {
      // Atualiza o contexto existente
      const [updatedContext] = await db
        .update(schema.userContexts)
        .set({
          currentLevel: data.currentLevel ?? existingContext.currentLevel,
          difficultyNotes:
            data.difficultyNotes ?? existingContext.difficultyNotes,
          interests: data.interests ?? existingContext.interests,
          learningGoals: data.learningGoals ?? existingContext.learningGoals,
          professionOrField:
            data.professionOrField ?? existingContext.professionOrField,
          updatedAt: new Date(),
        })
        .where(eq(schema.userContexts.id, existingContext.id))
        .returning()

      return {
        context: updatedContext,
        message: 'Contexto do usuário atualizado com sucesso.',
      }
    }

    // Cria um novo contexto
    const [newContext] = await db
      .insert(schema.userContexts)
      .values({
        currentLevel: data.currentLevel ?? 'A1',
        difficultyNotes: data.difficultyNotes ?? null,
        interests: data.interests ?? null,
        learningGoals: data.learningGoals ?? null,
        professionOrField: data.professionOrField ?? null,
        userId,
      })
      .returning()

    return {
      context: newContext,
      message: 'Contexto do usuário criado com sucesso.',
    }
  }
}
