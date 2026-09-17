import { hash } from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { redis } from '../../config/ioredis.ts'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'
import type { UpdateUserBodySchema } from '../../http/schemas/users/updateUserSchema.ts'
import { formatRelativeTime } from '../../lib/utils.ts'
import { UserNotFoundError } from './errors.ts'

export class UpdateUserService {
  async execute(userId: string, data: UpdateUserBodySchema) {
    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, userId),
    })

    if (!user) {
      throw new UserNotFoundError()
    }

    // Prepara os dados para atualização dinamicamente
    // biome-ignore lint/suspicious/noExplicitAny: it's necessary
    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    }

    if (data.name) {
      updateData.name = data.name
    }

    if (data.email) {
      updateData.email = data.email
    }

    if (data.avatarUrl) {
      updateData.avatarUrl = data.avatarUrl
    }

    // Realiza o hash se uma nova senha for informada
    if (data.password) {
      updateData.password = await hash(data.password, 10)
    }

    // Limpa ou atualiza o cache da sessão no Redis
    const cacheKey = `user-session:${userId}`
    await redis.del(cacheKey)

    // Atualiza o usuário e retorna o registro modificado
    const [updatedUser] = await db
      .update(schema.users)
      .set(updateData)
      .where(eq(schema.users.id, userId))
      .returning()

    return {
      message: `${user.name ?? 'Usuário'} atualizado com sucesso!`,
      user: {
        avatarUrl: updatedUser.avatarUrl,
        email: updatedUser.email,
        id: updatedUser.id,
        name: updatedUser.name,
        updatedAt: updatedUser.updatedAt
          ? formatRelativeTime(updatedUser.updatedAt)
          : updatedUser.updatedAt,
      },
    }
  }
}
