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

  // TODO: create the initial scenario state in the new screen
  const initialScenarioState: ScenarioState = {
    log: [{ text: scenario.openingPrompt, type: 'narrator' }],
    patient: {
      name: 'Jeff',
      description: 'A man in his 30s, whimpering on the ground like a puppy.',
      age: 30,
      gender: 'male',
      health: 100,
      heartRate: 60,
      respiratoryRate: 20,
      coreTemperatureCelsius: 37,
      bodyParts: [
        {
          part: 'leftLeg',
          description: 'The leg looks normal...',
          palpationResponse: 'You press on the left leg.',
        },
      ],
      ailments: [
        {
          name: 'Broken ankle',
          description: 'The boy broke is ankle maaaaan',
          effects: {
            heartRateMultiplier: 1.3,
            respiratoryRateMultiplier: 1.3,
            coreTemperatureCelsiusMultiplier: 1.3,
            bodyParts: [
              {
                part: 'leftLeg',
                description:
                  'The ankle is swollen and the foot turned the wrong way.',
                palpationResponse:
                  "Pressing on the outside of the patient's ankle causes severe pain.",
              },
            ],
          },
        },
      ],
    },
    environment: {
      description: "You're at the base of a mega alpine climb.",
      temperature: 0,
    },
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
}
