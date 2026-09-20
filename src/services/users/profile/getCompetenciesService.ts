import { eq } from 'drizzle-orm'
import { db } from '../../../db/connection.ts'
import { schema } from '../../../db/schema/index.ts'
import { UserNotFoundError } from '../errors.ts'

export class getCompetenciesService {
  async execute(userId: string) {
    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, userId),
      with: {
        competencies: true,
        context: true,
      },
    })

    if (!user) {
      throw new UserNotFoundError()
    }

    const targetGoal = `Goal: CEFR ${user.context?.currentLevel ?? 'B2'} Tech`
    const overallDescription =
      'Mapeamento dinâmico gerado com base em respostas de drills técnicos, code reviews e simulações de voice chat.'

    // Se o usuário já tiver dados computados na tabela user_competencies
    if (user.competencies.length > 0) {
      return {
        competencies: user.competencies.map((item) => ({
          clusters: item.clusters,
          id: item.id,
          level: item.levelLabel || item.level,
          percentage: item.percentage,
          tier: item.tier,
          title: item.title,
        })),
        overallDescription,
        targetGoal,
      }
    }

    return {
      competencies: [],
      overallDescription,
      targetGoal,
    }
  }
}
