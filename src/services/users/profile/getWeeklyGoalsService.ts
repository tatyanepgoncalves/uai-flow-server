import { and, eq } from 'drizzle-orm'
import { db } from '../../../db/connection.ts'
import { schema } from '../../../db/schema/index.ts'
import { UserNotFoundError } from '../errors.ts'

export class GetWeeklyGoalsService {
  async execute(userId: string) {
    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, userId),
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

    const goals = await db.query.userWeeklyGoals.findFirst({
      where: and(
        eq(schema.userWeeklyGoals.userId, userId),
        eq(schema.userWeeklyGoals.weekNumber, weekNumber)
      ),
    })

    if (goals) {
      const remainingChunks = goals.dailyChunksTarget - goals.dailyChunksCurrent
      const dailyChunksSubtext =
        remainingChunks > 0
          ? `Faltam ${remainingChunks} chunks para o bônus diário`
          : 'Meta diária alcançada!'

      return {
        activeListening: {
          current: goals.activeListeningMinutesCurrent,
          source: goals.activeListeningSource ?? 'Tech Podcasts & Eng Keynotes',
          target: goals.activeListeningMinutesTarget,
          unit: 'min',
        },
        dailyChunks: {
          current: goals.dailyChunksCurrent,
          subtext: goals.dailyChunksSubtext ?? dailyChunksSubtext,
          target: goals.dailyChunksTarget,
          unit: 'hoje',
        },
        pronunciationDrills: {
          current: goals.pronunciationDrillsCurrent,
          nextTopic:
            goals.pronunciationNextTopic ?? 'Idempotency & Backoff Strategies',
          target: goals.pronunciationDrillsTarget,
          unit: 'sessões',
        },
        weekLabel: `Semana ${goals.weekNumber}`,
      }
    }

    // Retorno fallback/padrão para quando ainda não há dados persistidos no ciclo semanal
    return {
      activeListening: {
        current: 45,
        source: 'Tech Podcasts & Eng Keynotes',
        target: 60,
        unit: 'min',
      },
      dailyChunks: {
        current: 15,
        subtext: 'Faltam 5 chunks para o bônus diário',
        target: 20,
        unit: 'hoje',
      },
      pronunciationDrills: {
        current: 3,
        nextTopic: 'Idempotency & Backoff Strategies',
        target: 5,
        unit: 'sessões',
      },
      weekLabel: `Semana ${weekNumber}`,
    }
  }
}
