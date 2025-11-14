import { ScenarioState } from '@shared/types/scenario'
import { UserId } from '@shared/types/user'
import { Context } from '../lib/middleware/context'

const createScenarioSession = async (
  scenarioId: number,
  userId: UserId,
  initialState: ScenarioState,
  ctx: Context,
) => {
  const scenarioSession = await ctx.prisma.scenarioSession.create({
    data: {
      userId,
      sessionId: ctx.sessionId,
      scenarioId,
      scenarioState: initialState,
    },
  })

  return scenarioSession
}

const getScenarioSession = async (userId: number, ctx: Context) => {
  const scenarioSession = await ctx.prisma.scenarioSession.findFirst({
    where: {
      userId,
    },
  })

  return scenarioSession
}

const updateScenarioSession = async (
  scenarioSessionId: number,
  newScenarioState: ScenarioState,
  ctx: Context,
) => {
  const updatedScenarioSession = await ctx.prisma.scenarioSession.update({
    where: { id: scenarioSessionId },
    data: { scenarioState: newScenarioState },
  })
  return updatedScenarioSession
}

const deleteScenarioSession = async (sessionId: string, ctx: Context) => {
  await ctx.prisma.scenarioSession.deleteMany({
    where: { sessionId: sessionId },
  })
}

const scenarioSessionRepository = {
  createScenarioSession,
  getScenarioSession,
  updateScenarioSession,
  deleteScenarioSession,
}

export default scenarioSessionRepository
