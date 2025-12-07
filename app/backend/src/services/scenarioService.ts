import { scenarioUtils } from '@backend/engine/scenarioUtils'
import { Context } from '@backend/lib/middleware/context'
import scenarioRepository from '@backend/repositories/scenarioRepository'
import {
  CreateScenarioSchema,
  DeleteScenarioSchema,
  GetScenarioSchema,
  GetScenariosSchema,
  ProcessAction,
  ScenarioState,
  UpdatePlayerNotesInput,
  UpdateSoapNoteInput,
} from '@shared/types/scenario'
import { UserId } from '@shared/types/user'
import { TRPCError } from '@trpc/server'
import { scenarioEngine } from '../engine/scenarioEngine'
import scenarioSessionRepository from '../repositories/scenarioSessionRepository'

const createScenario = async (input: CreateScenarioSchema, ctx: Context) => {
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
    await scenarioSessionRepository.getScenarioSession(userId, ctx)

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

  if (!scenarioUtils.isScenarioState(scenario.initialState)) {
    throw new TRPCError({
      code: 'PRECONDITION_FAILED',
      message: 'Invalid scenario state.',
    })
  }

  const scenarioSession = await scenarioSessionRepository.createScenarioSession(
    scenario.id,
    userId,
    scenario.initialState,
    ctx,
  )

  return scenarioSession
}

const deleteSession = async (ctx: Context) => {
  await scenarioSessionRepository.deleteScenarioSession(ctx.sessionId, ctx)
}

const processAction = async (input: ProcessAction, ctx: Context) => {
  const scenarioSession = await scenarioSessionRepository.getScenarioSession(
    ctx.user.id,
    ctx,
  )

  if (!scenarioSession) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'No scenario session found.',
    })
  }

  const actionResponse = scenarioEngine.processAction(
    ctx.user.id,
    ctx.sessionId,
    scenarioSession.scenarioId,
    input,
    scenarioSession.scenarioState as ScenarioState,
  )

  const newScenarioState = actionResponse.scenarioState

  const updatedScenarioSession =
    await scenarioSessionRepository.updateScenarioSession(
      scenarioSession.id,
      newScenarioState,
      ctx,
    )

  return updatedScenarioSession
}

const updatePlayerNotes = async (
  input: UpdatePlayerNotesInput,
  userId: UserId,
  ctx: Context,
) => {
  const scenarioSession = await scenarioSessionRepository.getScenarioSession(
    userId,
    ctx,
  )

  if (!scenarioSession) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'No scenario session found.',
    })
  }

  const { player } = scenarioSession.scenarioState as ScenarioState
  const newScenarioState = {
    ...(scenarioSession.scenarioState as ScenarioState),
    player: {
      ...player,
      notes: input.notes,
    },
  }

  await scenarioSessionRepository.updateScenarioSession(
    scenarioSession.id,
    newScenarioState,
    ctx,
  )

  return newScenarioState.player.notes
}

const updateSoapNote = async (
  input: UpdateSoapNoteInput,
  userId: UserId,
  ctx: Context,
) => {
  const scenarioSession = await scenarioSessionRepository.getScenarioSession(
    userId,
    ctx,
  )

  if (!scenarioSession) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'No scenario session found.',
    })
  }

  const { player } = scenarioSession.scenarioState as ScenarioState
  const newScenarioState = {
    ...(scenarioSession.scenarioState as ScenarioState),
    player: {
      ...player,
      soapNote: input.soapNote,
    },
  }

  await scenarioSessionRepository.updateScenarioSession(
    scenarioSession.id,
    newScenarioState,
    ctx,
  )

  return newScenarioState.player.soapNote
}

export const scenarioService = {
  createScenario,
  getScenarios,
  getScenario,
  deleteScenario,
  getScenarioSession,
  processAction,
  deleteSession,
  updatePlayerNotes,
  updateSoapNote,
}
