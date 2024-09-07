import { Context } from '@backend/lib/middleware/context'
import scenarioRepository from '@backend/repositories/scenarioRepository'
import {
  CreateScenarioSchema,
  DeleteScenarioSchema,
  GetScenarioSchema,
  ProcessActionSchema,
  ScenarioState,
} from '@shared/types/scenario'
import { TRPCError } from '@trpc/server'
import { scenarioEngine } from '../engine/scenarioEngine'
import scenarioSessionRepository from '../repositories/scenarioSessionRepository'

const createScenario = async (input: CreateScenarioSchema, ctx: Context) => {
  const createdScenario = await scenarioRepository.createScenario(input, ctx)

  return createdScenario
}

const getScenarios = async (ctx: Context) => {
  const scenarios = await scenarioRepository.getScenarios(ctx)

  return scenarios
}

const getScenario = async (input: GetScenarioSchema, ctx: Context) => {
  const scenario = await scenarioRepository.getScenario(input, ctx)

  return scenario
}

const deleteScenario = async (input: DeleteScenarioSchema, ctx: Context) => {
  const scenario = await scenarioRepository.deleteScenario(input, ctx)

  return scenario
}

const getScenarioSession = async (userId: string, ctx: Context) => {
  const existingScenarioSession =
    await scenarioSessionRepository.getScenarioSession(ctx.sessionId, ctx)

  if (existingScenarioSession) {
    return existingScenarioSession
  }

  // TODO: I'm not sure if I like having this method implicitly create a new scenario session

  const scenario = await scenarioRepository.getRandomScenario(ctx)

  if (!scenario) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'No scenario found.',
    })
  }

  const initialScenarioState: ScenarioState = {
    log: [{ text: scenario.openingPrompt, type: 'narrator' }],
  }

  const scenarioSession = await scenarioSessionRepository.createScenarioSession(
    scenario.id,
    userId,
    initialScenarioState,
    ctx,
  )

  return scenarioSession
}

const processAction = async (input: ProcessActionSchema, ctx: Context) => {
  const scenarioSession = await scenarioSessionRepository.getScenarioSession(
    ctx.sessionId,
    ctx,
  )

  if (!scenarioSession) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'No scenario session found.',
    })
  }

  const newScenarioState = scenarioEngine.processAction(input)

  const updatedScenarioSession =
    await scenarioSessionRepository.updateScenarioSession(
      scenarioSession.id,
      newScenarioState,
      ctx,
    )

  return updatedScenarioSession
}

export const scenarioService = {
  createScenario,
  getScenarios,
  getScenario,
  deleteScenario,
  getScenarioSession,
  processAction,
}
