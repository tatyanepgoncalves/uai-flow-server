import { and, eq } from 'drizzle-orm'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'
import type { CreateLanguageSchema } from '../../http/schemas/languages/create-language-schema.ts'
import { formatRelativeTime, generateSlug } from '../../lib/utils.ts'
import { UserNotFoundError } from '../users/errors.ts'

export class CreateLanguageService {
  execute(userId: string, data: CreateLanguageSchema) {
    return db.transaction(async (tx) => {
      const user = await tx.query.users.findFirst({
        where: eq(schema.users.id, userId),
      })

      if (!user) {
        throw new UserNotFoundError()
      }

      let language = await tx.query.languages.findFirst({
        where: eq(schema.languages.code, data.code),
      })

      if (!language) {
        const [newLanguage] = await tx
          .insert(schema.languages)
          .values({
            code: data.code,
            name: data.name,
            slug: generateSlug(data.name),
          })
          .returning()

        language = newLanguage
      }

      const existingRelation = await tx.query.userLanguages.findFirst({
        where: and(
          eq(schema.userLanguages.userId, userId),
          eq(schema.userLanguages.languageId, language.id)
        ),
      })

      if (!existingRelation) {
        await tx.insert(schema.userLanguages).values({
          languageId: language.id,
          userId,
        })
      }

      return {
        language: {
          code: language.code,
          createdAt: language.createdAt
            ? formatRelativeTime(language.createdAt)
            : language.createdAt,
          id: language.id,
          name: language.name,
          slug: language.slug,
        },
        message: `${language.name} adicionado com sucesso!`,
      }
    })
  }
}
