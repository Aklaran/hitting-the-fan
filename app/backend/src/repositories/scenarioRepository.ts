import {
  CreateScenarioSchema,
  DeleteScenarioSchema,
  GetScenarioSchema,
} from '@shared/types/scenario'
import { Context } from '../lib/middleware/context'

const createScenario = async (input: CreateScenarioSchema, ctx: Context) => {
  const scenario = await ctx.prisma.scenario.create({
    data: input,
  })

  return scenario
}

const getScenarios = async (ctx: Context) => {
  const scenarios = await ctx.prisma.scenario.findMany()

  return scenarios
}

const getScenario = async (input: GetScenarioSchema, ctx: Context) => {
  const scenario = await ctx.prisma.scenario.findUnique({
    where: { id: input.id },
  })

  return scenario
}

const getRandomScenario = async (ctx: Context) => {
  // TODO: Implement random scenario selection
  const scenario = await ctx.prisma.scenario.findFirst({
    orderBy: { id: 'asc' },
  })

  return scenario
}

const deleteScenario = async (input: DeleteScenarioSchema, ctx: Context) => {
  const scenario = await ctx.prisma.scenario.delete({
    where: { id: input.id },
  })

  return scenario
}

const scenarioRepository = {
  createScenario,
  getScenarios,
  getScenario,
  getRandomScenario,
  deleteScenario,
}

export default scenarioRepository
