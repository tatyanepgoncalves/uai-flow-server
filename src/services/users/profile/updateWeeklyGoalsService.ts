import { eq } from 'drizzle-orm'
import { db } from '../../../db/connection.ts'
import { schema } from '../../../db/schema/index.ts'
import type { UpdateWeeklyGoalsSchema } from '../../../http/schemas/users/profile/updateWeeklyGoalsSchema.ts'
import { UserNotFoundError, UserWeeklyGoalsNotFoundError } from '../errors.ts'

export class UpdateWeeklyGoalsService {
  async execute(userId: string, data: UpdateWeeklyGoalsSchema) {
    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, userId),
    })

    if (!user) {
      throw new UserNotFoundError()
    }

    // Busca metas semanais existentes
    const existingGoals = await db.query.userWeeklyGoals.findFirst({
      where: eq(schema.userWeeklyGoals.userId, userId),
    })

    if (!existingGoals) {
      throw new UserWeeklyGoalsNotFoundError()
    }

    // Atualiza metas semanais
    const [updatedGoals] = await db
      .update(schema.userWeeklyGoals)
      .set({
        activeListeningMinutesTarget:
          data.activeListeningMinutesTarget ??
          existingGoals.activeListeningMinutesTarget,
        activeListeningSource:
          data.activeListeningSource ?? existingGoals.activeListeningSource,
        dailyChunksTarget:
          data.dailyChunksTarget ?? existingGoals.dailyChunksTarget,
        pronunciationDrillsTarget:
          data.pronunciationDrillsTarget ??
          existingGoals.pronunciationDrillsTarget,
        pronunciationNextTopic:
          data.pronunciationNextTopic ?? existingGoals.pronunciationNextTopic,
        updatedAt: new Date(),
      })
      .where(eq(schema.userWeeklyGoals.id, existingGoals.id))
      .returning()

    return { message: 'Metas semanais atualizadas com sucesso.', updatedGoals }
  }
}
