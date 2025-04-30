import { Context } from '@backend/lib/middleware/context'
import scenarioRepository from '@backend/repositories/scenarioRepository'
import {
  CreateScenarioSchema,
  DeleteScenarioSchema,
  GetScenarioSchema,
  GetScenariosSchema,
  ProcessAction,
  ScenarioState,
} from '@shared/types/scenario'
import { UserId } from '@shared/types/user'
import { TRPCError } from '@trpc/server'
import { mvpScenarioState } from '../data/mvpScenarioState'
import { scenarioEngine } from '../engine/scenarioEngine'
import scenarioSessionRepository from '../repositories/scenarioSessionRepository'

const createScenario = async (input: CreateScenarioSchema, ctx: Context) => {
  input.initialState = mvpScenarioState

  const createdScenario = await scenarioRepository.createScenario(input, ctx)

  return createdScenario
}

const getScenarios = async (ctx: Context) => {
  const scenarios = await scenarioRepository.getScenarios(ctx)

  return scenarios as GetScenariosSchema[]
}

const getScenario = async (input: GetScenarioSchema, ctx: Context) => {
  const scenario = await scenarioRepository.getScenario(input, ctx)

  return scenario
}

const deleteScenario = async (input: DeleteScenarioSchema, ctx: Context) => {
  const scenario = await scenarioRepository.deleteScenario(input, ctx)

  return scenario
}

const getScenarioSession = async (userId: UserId, ctx: Context) => {
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

  // TODO: Use the DB state when I'm done devving
  // if (!scenarioUtils.isScenarioState(scenario.initialState)) {
  //   throw new TRPCError({
  //     code: 'PRECONDITION_FAILED',
  //     message: 'Invalid scenario state.',
  //   })
  // }

  // const initialState = scenario.initialState as ScenarioState
  const initialState = mvpScenarioState

  const scenarioSession = await scenarioSessionRepository.createScenarioSession(
    scenario.id,
    userId,
    initialState,
    ctx,
  )

  return scenarioSession
}

const deleteSession = async (ctx: Context) => {
  await scenarioSessionRepository.deleteScenarioSession(ctx.sessionId, ctx)
}

const processAction = async (input: ProcessAction, ctx: Context) => {
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

  const newScenarioState = scenarioEngine.processAction(
    input,
    scenarioSession.scenarioState as ScenarioState,
  )

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
  deleteSession,
}
