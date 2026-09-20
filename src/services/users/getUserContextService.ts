import { and, avg, count, eq, gte } from 'drizzle-orm'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schema/index.ts'
import { calculateListeningGoal } from '../../helpers/calculateListeningGoal.ts'
import { calculatePronunciationGoal } from '../../helpers/calculatePronunciationGoal.ts'
import { calculateStreaks } from '../../helpers/calculateStreaks.ts'
import { UserNotFoundError } from './errors.ts'

export class GetUserContextsService {
  async execute(userId: string) {
    // 1. Busca dados base do usuário e contexto em paralelo
    const [user, userContext] = await Promise.all([
      db.query.users.findFirst({
        where: eq(schema.users.id, userId),
      }),
      db.query.userContexts.findFirst({
        where: eq(schema.userContexts.userId, userId),
      }),
    ])

    if (!user) {
      throw new UserNotFoundError()
    }

    // 2. Definição de Intervalos de Data
    const now = new Date()
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    )

    const dayOfWeek = now.getDay()
    const distanceToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    const startOfWeek = new Date(startOfToday)
    startOfWeek.setDate(startOfToday.getDate() - distanceToMonday)

    // 3. Consultas paralelas
    const [
      [todayChunksResult],
      [totalMasteredResult],
      [weekMasteredResult],
      [accuracyResult],
      [pronunciationWeekResult],
      completedActivities,
    ] = await Promise.all([
      // Total de Chunks Concluídos (Hoje)
      db
        .select({ value: count() })
        .from(schema.userDailyChunks)
        .where(
          and(
            eq(schema.userDailyChunks.userId, userId),
            eq(schema.userDailyChunks.isCompleted, true),
            gte(schema.userDailyChunks.assignedDate, startOfToday)
          )
        ),

      // Total de Chunks Concluídos (Histórico Total)
      db
        .select({ value: count() })
        .from(schema.userDailyChunks)
        .where(
          and(
            eq(schema.userDailyChunks.userId, userId),
            eq(schema.userDailyChunks.isCompleted, true)
          )
        ),

      // Total de Chunks Concluídos (Nesta Semana)
      db
        .select({ value: count() })
        .from(schema.userDailyChunks)
        .where(
          and(
            eq(schema.userDailyChunks.userId, userId),
            eq(schema.userDailyChunks.isCompleted, true),
            gte(schema.userDailyChunks.assignedDate, startOfWeek)
          )
        ),

      // Média de Precisão (AI Score)
      db
        .select({
          averageScore: avg(schema.userSentences.aiScore),
          totalDrillsThisWeek: count(),
        })
        .from(schema.userSentences)
        .where(eq(schema.userSentences.userId, userId)),

      // Drills de Pronúncia Realizados na Semana
      db
        .select({ value: count() })
        .from(schema.userSentences)
        .where(
          and(
            eq(schema.userSentences.userId, userId),
            gte(schema.userSentences.createdAt, startOfWeek)
          )
        ),

      // Lista de Atividades para cálculo de Streaks e Goals
      db
        .select({
          assignedDate: schema.userDailyChunks.assignedDate,
        })
        .from(schema.userDailyChunks)
        .where(
          and(
            eq(schema.userDailyChunks.userId, userId),
            eq(schema.userDailyChunks.isCompleted, true)
          )
        ),
    ])

    // 4. Tratamento dos dados brutos
    const rawAvgScore = Number(accuracyResult?.averageScore ?? 0)
    const recallAccuracyPercentage = Number(
      ((rawAvgScore / 10) * 100).toFixed(1)
    )

    const dailyChunksCompletedToday = Number(todayChunksResult?.value ?? 0)
    const chunksMastered = Number(totalMasteredResult?.value ?? 0)
    const chunksMasteredThisWeek = Number(weekMasteredResult?.value ?? 0)
    const pronunciationDrillsCompleted = Number(
      pronunciationWeekResult?.value ?? 0
    )

    const validCompletedActivities = completedActivities.filter(
      (activity): activity is { assignedDate: Date } => !!activity.assignedDate
    )

    const streaks = calculateStreaks(
      validCompletedActivities.map(({ assignedDate }) => assignedDate)
    )

    const listeningGoal = calculateListeningGoal(
      validCompletedActivities,
      startOfWeek
    )
    const pronunciationGoal = calculatePronunciationGoal(
      pronunciationDrillsCompleted
    )

    // 5. Retorno estruturado conforme o Schema
    return {
      message: 'Contexto do usuário encontrado com sucesso.',
      user: {
        context: userContext
          ? {
              currentLevel: userContext.currentLevel,
              interests: userContext.interests,
              learningGoals: userContext.learningGoals,
              professionOrField: userContext.professionOrField,
            }
          : null,
        stats: {
          activeStreakDays: streaks.activeStreakDays,
          chunksMastered,
          chunksMasteredThisWeek,
          immersionTimeHours: Number((chunksMastered * 0.05).toFixed(1)),
          recallAccuracyPercentage,
          streakRecordDays: streaks.streakRecordDays,
        },
        weeklyGoals: {
          activeListeningGoalMinutes:
            listeningGoal.activeListeningGoalMinutes ?? 60,
          activeListeningMinutes: listeningGoal.activeListeningMinutes,
          dailyChunksCompletedToday,
          dailyChunksGoal: user.dailyGoalChunks ?? 3,
          pronunciationDrillsCompleted,
          pronunciationDrillsGoal:
            pronunciationGoal.pronunciationDrillsGoal ?? 10,
        },
      },
    }
  }
}
