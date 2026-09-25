import { and, eq, isNull, or } from 'drizzle-orm'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'
import { LanguageNotFoundError } from './error.ts'
import type { DeleteLanguageTemporaryQuery } from '../../http/schemas/languages/deleteLanguageTemporarySchema.ts'

export class DeleteLanguageTemporaryService {
  async execute({ slug, id }: DeleteLanguageTemporaryQuery) {
    const language = await db.query.languages.findFirst({
      where: and(
        or(
          slug ? eq(schema.languages.slug, slug) : undefined,
          id ? eq(schema.languages.id, id) : undefined
        ),
        isNull(schema.languages.deletedAt)
      ),
    })

    if (!language) {
      throw new LanguageNotFoundError()
    }

    await db
      .update(schema.languages)
      .set({ deletedAt: new Date() })
      .where(eq(schema.languages.id, language.id))

    return {
      message: `${language.name} excluído temporariamente com sucesso!`,
    }
  }
}
