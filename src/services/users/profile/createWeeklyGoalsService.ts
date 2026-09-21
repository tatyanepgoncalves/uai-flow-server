import { eq } from 'drizzle-orm'
import { db } from '../../../db/connection.ts'
import { schema } from '../../../db/schema/index.ts'
import type { CreateWeeklyGoalsSchema } from '../../../http/schemas/users/profile/createWeeklyGoalsSchema.ts'
import { UserNotFoundError } from '../errors.ts'

export class CreateWeeklyGoalsService {
  async execute(userId: string, data: CreateWeeklyGoalsSchema) {
    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, userId),
      with: {
        weeklyGoals: true,
      },
    })

    if (!user) {
      throw new UserNotFoundError()
    }

    // Calcula o número da semana atual no ano
    const currentDate = new Date()
    const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1)
    const pastDaysOfYear =
      (currentDate.getTime() - firstDayOfYear.getTime()) / 86_400_000
    const weekNumber = Math.ceil(
      (pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7
    )

    const [newWeeklyGoals] = await db
      .insert(schema.userWeeklyGoals)
      .values({
        activeListeningMinutesTarget: data.activeListeningMinutesTarget,
        activeListeningSource: data.activeListeningSource,
        dailyChunksTarget: data.pronunciationDrillsTarget,
        pronunciationNextTopic: data.pronunciationNextTopic,
        userId,
        weekNumber,
      })
      .returning()

    return {
      activeListening: {
        current: newWeeklyGoals.activeListeningMinutesCurrent,
        source: newWeeklyGoals.activeListeningSource,
        target: newWeeklyGoals.activeListeningMinutesTarget,
        unit: 'min',
      },
      dailyChunks: {
        current: newWeeklyGoals.dailyChunksCurrent,
        subtext: `Faltam ${newWeeklyGoals.dailyChunksTarget - newWeeklyGoals.dailyChunksCurrent} chunks para o bônus diário`,
        target: newWeeklyGoals.dailyChunksTarget,
        unit: 'hoje',
      },
      pronunciationDrills: {
        current: newWeeklyGoals.pronunciationDrillsCurrent,
        nextTopic: newWeeklyGoals.pronunciationNextTopic,
        target: newWeeklyGoals.pronunciationDrillsTarget,
        unit: 'sessões',
      },
      weekLabel: `Semana ${newWeeklyGoals.weekNumber}`,
    }
  }
}
