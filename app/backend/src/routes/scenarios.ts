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
  updatePlayerNotesInputSchema,
  updateSoapNoteInputSchema,
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

  get: publicProcedure
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

  getSessionState: publicProcedure.query(async ({ ctx }) => {
    const { user } = ctx

    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You are not authorized to view scenario sessions.',
      })
    }

    const scenarioSession = await scenarioService.getScenarioSession(
      user.id,
      ctx,
    )

    const { log, player } = scenarioSession.scenarioState as ScenarioState
    return { log, player }
  }),

  processAction: publicProcedure
    .input(processActionSchema)
    .mutation(async ({ input, ctx }) => {
      const updatedScenarioSession = await scenarioService.processAction(
        input,
        ctx,
      )

      const { log, player } =
        updatedScenarioSession.scenarioState as ScenarioState
      return { log, player }
    }),

  deleteSession: publicProcedure.mutation(async ({ ctx }) => {
    return await scenarioService.deleteSession(ctx)
  }),

  updatePlayerNotes: publicProcedure
    .input(updatePlayerNotesInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx

      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to update player notes.',
        })
      }

      const newNotes = await scenarioService.updatePlayerNotes(
        input,
        user.id,
        ctx,
      )

      return newNotes
    }),

  updateSoapNote: publicProcedure
    .input(updateSoapNoteInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx

      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You are not authorized to update the soap note.',
        })
      }

      const newSoapNote = await scenarioService.updateSoapNote(
        input,
        user.id,
        ctx,
      )

      return newSoapNote
    }),
})

export default scenariosRouter
