import { and, eq, isNull } from 'drizzle-orm'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'
import type { UpdateLanguageBody } from '../../http/schemas/languages/updateLanguageSchema.ts'
import { formatRelativeTime, generateSlug } from '../../lib/utils.ts'
import { LanguageAlreadyExistError, LanguageNotFoundError } from './error.ts'

export class UpdateLanguageService {
  async execute(slug: string, data: UpdateLanguageBody) {
    const languageExits = await db.query.languages.findFirst({
      where: and(
        eq(schema.languages.slug, slug),
        isNull(schema.languages.deletedAt)
      ),
    })

    if (!languageExits) {
      throw new LanguageNotFoundError()
    }

    // Se tentar alterar, verifica se já não existe o idioma existente
    if (data.name && data.name !== languageExits.name) {
      const languageExists = await db.query.languages.findFirst({
        where: eq(schema.languages.name, data.name),
      })

      if (languageExists) {
        throw new LanguageAlreadyExistError()
      }
    }

    // Prepara os dados para atualização dinamicamente
    // biome-ignore lint/suspicious/noExplicitAny: it's necessary
    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    }

    if (data.name !== undefined) {
      updateData.name = data.name
      updateData.slug = generateSlug(data.name)
    }

    if (data.code !== undefined) {
      updateData.code = data.code
    }

    // Atualiza o usuário e retorna o registro modificado
    const [updatedLanguage] = await db
      .update(schema.languages)
      .set(updateData)
      .where(eq(schema.languages.slug, slug))
      .returning()

    return {
      language: {
        code: updatedLanguage.code,
        id: updatedLanguage.id,
        name: updatedLanguage.name,
        slug: updatedLanguage.slug,
        updatedAt: updatedLanguage.updatedAt
          ? formatRelativeTime(updatedLanguage.updatedAt)
          : updatedLanguage.updatedAt,
      },
      message: `Atualizando ${languageExits.name} para ${updateData.name} com sucesso!`,
    }
  }
}
