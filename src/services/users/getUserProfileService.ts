import { and, avg, count, eq, gte } from 'drizzle-orm'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'
import { calculateListeningGoal } from '../../helpers/calculateListeningGoal.ts'
import { calculatePronunciationGoal } from '../../helpers/calculatePronunciationGoal.ts'
import { calculateStreaks } from '../../helpers/calculateStreaks.ts'
import { formatRelativeTime } from '../../lib/utils.ts'
import { UserNotFoundError } from './errors.ts'

export class GetUserProfileService {
  async execute(userId: string) {
    return await db.transaction(async (tx) => {
      // Busca dados base do usuário
      const user = await tx.query.users.findFirst({
        where: eq(schema.users.id, userId),
      })

      if (!user) {
        throw new UserNotFoundError()
      }

      // Definição de Intervalos de Data
      const now = new Date()
      const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      )

      // Início da semana (Segunda-feira)
      const dayOfWeek = now.getDay()
      const distanceToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
      const startOfWeek = new Date(startOfToday)
      startOfWeek.setDate(startOfToday.getDate() - distanceToMonday)

      // --- CONSULTAS PARALELAS NO BANCO ---

      // Total de Chunks Concluídos (Hoje)
      const [todayChunksResult] = await tx
        .select({ value: count() })
        .from(schema.userDailyChunks)
        .where(
          and(
            eq(schema.userDailyChunks.userId, userId),
            eq(schema.userDailyChunks.isCompleted, true),
            gte(schema.userDailyChunks.assignedDate, startOfToday)
          )
        )

      // Total de Chunks Concluídos (Histórico Total)
      const [totalMasteredResult] = await tx
        .select({ value: count() })
        .from(schema.userDailyChunks)
        .where(
          and(
            eq(schema.userDailyChunks.userId, userId),
            eq(schema.userDailyChunks.isCompleted, true)
          )
        )

      // Total de Chunks Concluídos (Nesta Semana)
      const [weekMasteredResult] = await tx
        .select({ value: count() })
        .from(schema.userDailyChunks)
        .where(
          and(
            eq(schema.userDailyChunks.userId, userId),
            eq(schema.userDailyChunks.isCompleted, true),
            gte(schema.userDailyChunks.assignedDate, startOfWeek)
          )
        )

      // Média de Precisão / Recall Accuracy (Baseado em aiScore da tabela userSentences)
      const [accuracyResult] = await tx
        .select({
          averageScore: avg(schema.userSentences.aiScore),
          totalDrillsThisWeek: count(),
        })
        .from(schema.userSentences)
        .where(eq(schema.userSentences.userId, userId))

      // Drills de Pronúncia Realizados na Semana
      const [pronunciationWeekResult] = await tx
        .select({ value: count() })
        .from(schema.userSentences)
        .where(
          and(
            eq(schema.userSentences.userId, userId),
            gte(schema.userSentences.createdAt, startOfWeek)
          )
        )

      // --- CÁLCULO DE VALORES PROCESSADOS ---

      // aiScore varia de 0 a 10 no schema -> Convertemos para porcentagem (0-100%)
      const rawAvgScore = Number(accuracyResult?.averageScore ?? 0)
      const recallAccuracyPercentage = Number(
        ((rawAvgScore / 10) * 100).toFixed(1)
      )

      // Chunks e Drills
      const dailyChunksCompletedToday = Number(todayChunksResult?.value ?? 0)
      const chunksMastered = Number(totalMasteredResult?.value ?? 0)
      const chunksMasteredThisWeek = Number(weekMasteredResult?.value ?? 0)
      const pronunciationDrillsCompleted = Number(
        pronunciationWeekResult?.value ?? 0
      )

      const completedActivities =( await tx
        .select({
          assignedDate: schema.userDailyChunks.assignedDate,
        })
        .from(schema.userDailyChunks)
        .where(
          and(
            eq(schema.userDailyChunks.userId, userId),
            eq(schema.userDailyChunks.isCompleted, true)
          )
        )).filter((activity): activity is { assignedDate: Date } => !!activity.assignedDate)

      const activityDates = new Set(
        completedActivities.map(({ assignedDate }) => {
          const date = new Date(assignedDate)
          return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        })
      )

      const dateKey = (date: Date) =>
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

      const cursor = new Date(startOfToday)

      // Permite que o streak continue caso ainda não haja atividade hoje
      if (!activityDates.has(dateKey(cursor))) {
        cursor.setDate(cursor.getDate() - 1)
      }

      let activeStreakDays = 0

      while (activityDates.has(dateKey(cursor))) {
        // biome-ignore lint/style/noIncrementDecrement: it's necessary
        activeStreakDays++
        cursor.setDate(cursor.getDate() - 1)
      }

      const streaks = calculateStreaks(
        completedActivities.map(({ assignedDate }) => assignedDate)
      )

      const listeningGoal = calculateListeningGoal(
        completedActivities,
        startOfWeek
      )
      const pronunciationGoal = calculatePronunciationGoal(
        pronunciationDrillsCompleted
      )

      // Retorno dinâmico montado
      return {
        message: 'Perfil do usuário encontrado com sucesso.',
        user: {
          avatarUrl: user.avatarUrl ?? null,
          createdAt: user.createdAt
            ? formatRelativeTime(user.createdAt)
            : user.createdAt,
          email: user.email ?? null,
          id: user.id,
          name: user.name,
          slug: user.slug,

          stats: {
            activeStreakDays: streaks.activeStreakDays,
            chunksMastered,
            chunksMasteredThisWeek,
            immersionTimeHours: Number((chunksMastered * 0.05).toFixed(1)), // Estimativa (ex: 3 min por chunk)
            recallAccuracyPercentage,
            streakRecordDays: streaks.streakRecordDays,
          },

          updatedAt: user.updatedAt ? formatRelativeTime(user.updatedAt) : null,

          weeklyGoals: {
            ...listeningGoal,
            ...pronunciationGoal,
            dailyChunksCompletedToday,
            dailyChunksGoal: user.dailyGoalChunks ?? 3,
          },
        },
      }
    })
  }
}
