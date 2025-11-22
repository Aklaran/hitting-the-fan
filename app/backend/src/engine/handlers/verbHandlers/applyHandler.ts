import {
  ActionResponse,
  ApplyTarget,
  Command,
  ScenarioState,
  VerbHandler,
} from '@shared/types/scenario'
import withApplicable from '../enrichers/withApplicable'
import withBodyPart from '../enrichers/withBodyPart'
import hasCommandObject from '../guards/hasCommandObject'
import isDistanceFromPatient from '../guards/isDistanceFromPatient'
import {
  enrich,
  guard,
  Handler,
  pipeHandlers,
  transform,
} from '../pipeline/handlerPipe'
import {
  ApplicableContext,
  BodyPartContext,
  PipelineContext,
} from '../pipeline/pipelineContexts'

export const applyHandler: VerbHandler = {
  execute: (command: Command, scenarioState: ScenarioState): ActionResponse => {
    return pipeHandlers(
      guard<PipelineContext>(hasCommandObject),
      guard(isDistanceFromPatient('near')),
      enrich<PipelineContext, ApplicableContext>(withApplicable),
      enrich<ApplicableContext, BodyPartContext>(withBodyPart),
      transform<ApplicableContext & BodyPartContext>(
        (command, scenarioState, context) =>
          responseBank[context.applicable](command, scenarioState, context),
      ),
    )(command, scenarioState, {})
  },
}

const responseBank: Record<
  ApplyTarget,
  Handler<
    ApplicableContext & BodyPartContext,
    ApplicableContext & BodyPartContext
  >
> = {
  splint: (_command, scenarioState, context) => {
    // Check if a splint has already been applied
    // Apply modifications to the ailment's affected CSMs
    // Apply modifications to the ailment's description

    return {
      responseText: `You apply the splint to the ${context.bodyPart.partName}.`,
      scenarioState,
      result: 'success',
    }
  },
}
