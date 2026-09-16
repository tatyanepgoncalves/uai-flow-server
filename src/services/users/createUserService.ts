import { hash } from 'bcryptjs'
import { eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'
import { env } from '../../config/env.ts'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'
import type { CreateUserSchema } from '../../http/schemas/users/createUserSchema.ts'
import { formatRelativeTime, generateSlug } from '../../lib/utils.ts'
import { UserAlreadyExistError } from './errors.ts'

export class CreateUserService {
  async execute(data: CreateUserSchema) {
    return await db.transaction(async (tx) => {
      // Verifica já existe usuário vinculado ao email
      const userExist = await tx.query.users.findFirst({
        where: eq(schema.users.email, data.email),
      })

      if (userExist) {
        throw new UserAlreadyExistError()
      }

      const passwordHash = await hash(data.password, 10)
      const slug = generateSlug(data.name)

      const [user] = await tx
        .insert(schema.users)
        .values({
          email: data.email,
          name: data.name,
          password: passwordHash,
          slug,
        })
        .returning()

      // Criar contexto do usuário
      await tx.insert(schema.userContexts).values({
        currentLevel: data.cefr,
        learningGoals: data.scenarios?.join(', '),
        professionOrField: data.profession,
        userId: user.id,
      })

      const token = jwt.sign(
        {
          id: user.id,
        },
        env.JWT_SECRET,
        {
          expiresIn: '10d',
        }
      )

      await tx.insert(schema.authTokens).values({
        expiredAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days
        token,
        userId: user.id,
      })

      return {
        message: `Usuário criado com sucesso. Bem vindo ao sistema, ${user.name}!`,
        token,
        user: {
          createdAt: user.createdAt
            ? formatRelativeTime(user.createdAt)
            : user.createdAt,
          email: user.email,
          id: user.id,
          name: user.name,
          slug: user.slug,
        },
      }
    })
  }
}
