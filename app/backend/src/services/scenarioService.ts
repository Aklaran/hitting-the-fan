import { Context } from '@backend/lib/middleware/context'
import scenarioRepository from '@backend/repositories/scenarioRepository'
import {
  CreateScenarioSchema,
  DeleteScenarioSchema,
  GetScenarioSchema,
} from '@shared/types/scenario'

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

export const scenarioService = {
  createScenario,
  getScenarios,
  getScenario,
  deleteScenario,
}
