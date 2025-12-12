import {
  CreateScenarioSchema,
  DeleteScenarioSchema,
  GetScenarioSchema,
  GetScenariosSchema,
  Scenario,
} from '@shared/types/scenario'
import { Context } from '../lib/middleware/context'

const createScenario = async (input: CreateScenarioSchema, ctx: Context) => {
  const scenario = await ctx.prisma.scenario.create({
    data: {
      ...input,
      perfectActions: input.perfectActions ?? [],
      badActions: input.badActions ?? undefined,
    },
  })

  return {
    ...scenario,
    perfectActions:
      (scenario.perfectActions as Scenario['perfectActions']) ?? [],
    badActions: scenario.badActions
      ? (scenario.badActions as Scenario['badActions'])
      : undefined,
  } as Scenario
}

const getScenarios = async (ctx: Context): Promise<GetScenariosSchema[]> => {
  const scenarios = await ctx.prisma.scenario.findMany()

  return scenarios.map((scenario) => ({
    ...scenario,
    perfectActions:
      (scenario.perfectActions as Scenario['perfectActions']) ?? [],
    badActions: scenario.badActions
      ? (scenario.badActions as Scenario['badActions'])
      : undefined,
  })) as GetScenariosSchema[]
}

const getScenario = async (input: GetScenarioSchema, ctx: Context) => {
  const scenario = await ctx.prisma.scenario.findUnique({
    where: { id: input.id },
  })

  if (!scenario) {
    return null
  }

  return {
    ...scenario,
    perfectActions:
      (scenario.perfectActions as Scenario['perfectActions']) ?? [],
    badActions: scenario.badActions
      ? (scenario.badActions as Scenario['badActions'])
      : undefined,
  } as Scenario
}

const getRandomScenario = async (ctx: Context) => {
  // TODO: Implement random scenario selection
  const scenario = await ctx.prisma.scenario.findFirst({
    orderBy: { id: 'asc' },
  })

  if (!scenario) {
    return null
  }

  return {
    ...scenario,
    perfectActions:
      (scenario.perfectActions as Scenario['perfectActions']) ?? [],
    badActions: scenario.badActions
      ? (scenario.badActions as Scenario['badActions'])
      : undefined,
  } as Scenario
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
