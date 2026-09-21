import { and, eq, gte, lte, sql } from 'drizzle-orm'
import { db } from '../../../db/connection.ts'
import { schema } from '../../../db/schema/index.ts'
import { calculateHeatmapLevel } from '../../../helpers/calculate-heatmap-level.ts'
import { formatRelativeTime } from '../../../lib/utils.ts'
import { UserNotFoundError } from '../errors.ts'

export class GetActivityHeatmapService {
  async execute(days: number, userId: string) {
    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, userId),
    })

    if (!user) {
      throw new UserNotFoundError()
    }

    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - days)

    // Consulta agrupada por data apenas para atividades concluídas
    const rawActivities = await db
      .select({
        count:
          sql<number>`CAST(COUNT(${schema.userDailyChunks.id}) AS INTEGER)`.as(
            'count'
          ),
        date: sql<string>`DATE(${schema.userDailyChunks.assignedDate})`.as(
          'date'
        ),
      })
      .from(schema.userDailyChunks)
      .where(
        and(
          eq(schema.userDailyChunks.userId, userId),
          eq(schema.userDailyChunks.isCompleted, true),
          gte(schema.userDailyChunks.assignedDate, startDate),
          lte(schema.userDailyChunks.assignedDate, endDate)
        )
      )
      .groupBy(sql`DATE(${schema.userDailyChunks.assignedDate})`)

    const activityMap = new Map<string, number>()
    let totalActiveDays = 0

    for (const row of rawActivities) {
      if (row.date) {
        activityMap.set(row.date, row.count)
        if (row.count > 0) {
          // biome-ignore lint/style/noIncrementDecrement: it's necessary
          totalActiveDays++
        }
      }
    }

    // Preenche todos os dias do intervalo
    const activities: Array<{
      count: number
      date: string
      level: ReturnType<typeof calculateHeatmapLevel>
    }> = []

    const currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      const [formattedDate] = currentDate.toISOString().split('T')[0]
      const count = activityMap.get(formattedDate) ?? 0

      activities.push({
        count,
        date: formattedDate,
        level: calculateHeatmapLevel(count),
      })

      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Porcentagem de dias ativos no mês recente (últimos 30 dias)
    const daysInLastMonth = 30
    const activeDaysLastMonth = activities
      .slice(-daysInLastMonth)
      .filter((a) => a.count > 0).length

    const activeDaysPercentage = Number(
      ((activeDaysLastMonth / daysInLastMonth) * 100).toFixed(0)
    )

    const [formattedEndDate] = formatRelativeTime(endDate)
    const [formattedStartDate] = formatRelativeTime(startDate)

    return {
      activeDaysPercentage,
      activities,
      endDate: formattedEndDate,
      startDate: formattedStartDate,
      totalActiveDays,
    }
  }
}
