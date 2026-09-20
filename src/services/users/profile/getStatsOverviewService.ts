import { eq } from 'drizzle-orm'
import { db } from '../../../db/connection.ts'
import { schema } from '../../../db/schema/index.ts'
import { UserNotFoundError } from '../errors.ts'

export class getStatsOverviewService {
  async execute(userId: string) {
    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, userId),
      with: {
        stats: true,
      },
    })

    if (!user) {
      throw new UserNotFoundError()
    }

    // Retorna valores zerados como fallback se registro ainda não existir
    const chunksMasteredTotal = user.stats?.chunksMastered ?? 0
    const chunksThisWeek = user.stats?.chunksThisWeek ?? 0
    const currentStreak = user.stats?.currentStreakDays ?? 0
    const streakRecord = user.stats?.streakRecordDays ?? 0
    const accuracy = user.stats?.recallAccuracyPercentage ?? 0
    const totalMinutes = user.stats?.totalImmersionMinutes ?? 0
    const dailyAvg = user.stats?.dailyAvgImmersionMinutes ?? 0

    // Converte os minutos totais em horas arredondadas para 1 casa decimal (ex: 42.5 hrs)
    const totalHours = Number((totalMinutes / 60).toFixed(1))

    return {
      activeStreak: {
        currentDays: currentStreak,
        recordDays: streakRecord,
      },
      chunksMastered: {
        thisWeek: chunksThisWeek,
        total: chunksMasteredTotal,
      },
      immersionTime: {
        dailyAvgMinutes: dailyAvg,
        totalHours,
      },
      recallAccuracy: {
        algorithm: 'SRS SM-2',
        percentage: accuracy,
      },
    }
  }
}
