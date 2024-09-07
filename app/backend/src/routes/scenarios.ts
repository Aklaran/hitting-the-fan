import {
  protectedProcedure,
  publicProcedure,
  router,
} from '@backend/lib/clients/trpc'
import {
  createScenarioSchema,
  deleteScenarioSchema,
  getScenarioSchema,
  processActionSchema,
  ScenarioState,
} from '@shared/types/scenario'
import logger from '@shared/util/logger'
import { TRPCError } from '@trpc/server'
import { scenarioService } from '../services/scenarioService'

const scenariosRouter = router({
  create: protectedProcedure
    .input(createScenarioSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const newScenario = await scenarioService.createScenario(input, ctx)

        return newScenario
      } catch (error) {
        logger.error(error)

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while creating the scenario',
          cause: error,
        })
      }
    }),

  list: publicProcedure.query(async ({ ctx }) => {
    return await scenarioService.getScenarios(ctx)
  }),

  get: protectedProcedure
    .input(getScenarioSchema)
    .query(async ({ input, ctx }) => {
      return await scenarioService.getScenario(input, ctx)
    }),

  delete: protectedProcedure
    .input(deleteScenarioSchema)
    .mutation(async ({ input, ctx }) => {
      // TODO: Handle errors
      return await scenarioService.deleteScenario(input, ctx)
    }),

  getSessionState: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx

    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You are not authorized to initialize SRS',
      })
    }

    const scenarioSession = await scenarioService.getScenarioSession(
      user.id,
      ctx,
    )

    return scenarioSession.scenarioState as ScenarioState
  }),

  processAction: protectedProcedure
    .input(processActionSchema)
    .mutation(async ({ input, ctx }) => {
      const updatedScenarioSession = await scenarioService.processAction(
        input,
        ctx,
      )

      return updatedScenarioSession.scenarioState as ScenarioState
    }),
})

export default scenariosRouter
