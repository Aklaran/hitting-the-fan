import {
  ActionResponse,
  Ailment,
  ApplyTarget,
  Command,
  ScenarioState,
  VerbHandler,
} from '@shared/types/scenario'
import withApplicable from '../enrichers/withApplicable'
import withBodyPart from '../enrichers/withBodyPart'
import withBodyPartAilments from '../enrichers/withBodyPartAilments'
import canApply from '../guards/canApply'
import hasCommandObject from '../guards/hasCommandObject'
import hasNotBeenTreated from '../guards/hasNotBeenTreated'
import isDistanceFromPatient from '../guards/isDistanceFromPatient'
import {
  enrich,
  guard,
  Handler,
  pipeHandlers,
  transform,
} from '../pipeline/handlerPipe'
import {
  AilmentsContext,
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
      enrich<ApplicableContext & BodyPartContext, AilmentsContext>(
        withBodyPartAilments,
      ),
      guard<ApplicableContext & BodyPartContext & AilmentsContext>(
        hasNotBeenTreated,
      ),
      guard<ApplicableContext & BodyPartContext & AilmentsContext>(canApply),
      transform<ApplicableContext & BodyPartContext & AilmentsContext>(
        (command, scenarioState, context) =>
          responseBank[context.applicable](command, scenarioState, context),
      ),
    )(command, scenarioState, {})
  },
}

const responseBank: Record<
  ApplyTarget,
  Handler<
    ApplicableContext & BodyPartContext & AilmentsContext,
    ApplicableContext & BodyPartContext & AilmentsContext
  >
> = {
  splint: (_command, scenarioState, context) => {
    const newAilments: Ailment[] = context.ailments.map((ailment) => ({
      ...ailment,
      appliedTreatments: [...ailment.appliedTreatments, 'splint'],
    }))

    const newState: ScenarioState = {
      ...scenarioState,
      patient: {
        ...scenarioState.patient,
        ailments: newAilments,
      },
    }

    return {
      responseText: `You apply the splint to the ${context.bodyPart.partName}.`,
      scenarioState: newState,
      result: 'success',
    }
  },
}
