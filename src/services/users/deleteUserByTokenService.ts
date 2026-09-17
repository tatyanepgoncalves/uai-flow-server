import { and, eq, isNull } from 'drizzle-orm'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'
import { UserNotFoundError } from './errors.ts'

export class DeleteUserByTokenService {
  async execute(userId: string) {
    const user = await db.query.users.findFirst({
      where: and(eq(schema.users.id, userId), isNull(schema.users.deletedAt)),
    })

    if (!user) {
      throw new UserNotFoundError()
    }

    await db.delete(schema.users).where(eq(schema.users.id, userId))

    await db
      .delete(schema.authTokens)
      .where(eq(schema.authTokens.userId, userId))

    return {
      message: `${user.name} deletado com sucesso!`,
      user: {
        id: user.id,
        name: user.name,
      },
    }
  }
}
