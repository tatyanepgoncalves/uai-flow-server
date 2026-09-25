import { and, eq, isNull, or } from 'drizzle-orm'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'
import type { DeleteLanguageQuery } from '../../http/schemas/languages/deleteLanguageSchema.ts'
import { LanguageNotFoundError } from './error.ts'

export class DeleteLanguageService {
  async execute({ slug, id }: DeleteLanguageQuery) {
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
      .delete(schema.languages)
      .where(eq(schema.languages.id, language.id))

    return {
      message: `${language.name} deletado com sucesso!`,
    }
  }
}
