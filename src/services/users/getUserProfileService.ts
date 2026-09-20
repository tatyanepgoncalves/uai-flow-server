import { eq } from 'drizzle-orm'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'
import { formatRelativeTime } from '../../lib/utils.ts'
import { UserNotFoundError } from './errors.ts'

export class GetUserProfileService {
  async execute(userId: string) {
    return await db.transaction(async (tx) => {
      const user = await tx.query.users.findFirst({
        where: eq(schema.users.id, userId),
      })

      if (!user) {
        throw new UserNotFoundError()
      }

      return {
        message: 'Perfil do usuário encontrado com sucesso.',
        user: {
          avatarUrl: user.avatarUrl ? user.avatarUrl : null,
          createdAt: user.createdAt
            ? formatRelativeTime(user.createdAt)
            : user.createdAt,
          email: user.email ? user.email : null,
          id: user.id,
          name: user.name,
          slug: user.slug,
          updatedAt: user.updatedAt ? formatRelativeTime(user.updatedAt) : null,
        },
      }
    })
  }
}
