import { scenarioUtils } from '@backend/engine/scenarioUtils'
import {
  ActionResponse,
  Command,
  MOTION_PRIORITIES,
  PerformTarget,
  ScenarioState,
  VerbHandler,
} from '@shared/types/scenario'
import withBodyPart from '../enrichers/withBodyPart'
import withPerformable from '../enrichers/withPerformable'
import hasCommandObject from '../guards/hasCommandObject'
import isDistanceFromPatient from '../guards/isDistanceFromPatient'
import { enrich, guard, pipeHandlers, transform } from '../pipeline/handlerPipe'
import {
  BodyPartContext,
  BodyPartEffectsContext,
  PerformableContext,
  PipelineContext,
} from '../pipeline/pipelineContexts'

export const performHandler: VerbHandler = {
  execute: (command: Command, scenarioState: ScenarioState): ActionResponse => {
    return pipeHandlers(
      guard<PipelineContext>(hasCommandObject),
      guard(isDistanceFromPatient('near')),
      enrich<PipelineContext, PerformableContext>(withPerformable),
      transform((_, scenarioState, context) =>
        procedures[context.performable](command, scenarioState, context),
      ),
    )(command, scenarioState, {})
  },
}

const procedures: Record<
  PerformTarget,
  (
    command: Command,
    scenarioState: ScenarioState,
    context: PerformableContext,
  ) => ActionResponse
> = {
  bloodSweep: (_command, scenarioState) => {
    let responseText =
      "You run your hands around the outside of the patient's clothing and under them to find major bleeds."
    const majorBleeds = scenarioState.patient.ailments.filter(
      (ailment) => ailment.effects.bleed === 'major',
    )

    if (!majorBleeds || majorBleeds.length === 0) {
      responseText += ' You do not find any concerning amounts of blood.'
      return { responseText, scenarioState, result: 'success' }
    }

    // TODO: Make a util function to create a grammatically correct comma-separated list
    const bleedLocations = majorBleeds
      .flatMap((bleed) => bleed.effects.bodyParts)
      .map((bodyPart) => bodyPart.partName)
      .join(', ')

    responseText += ` You find concerning amounts of blood on the ${bleedLocations}.`
    return { responseText, scenarioState, result: 'success' }
  },

  focusedSpineAssessment: (_command, scenarioState) => {
    const responseText =
      'You inform the patient that you are going to perform a focused spine assessment. Proceed with the steps of the assessment.'

    return { responseText, scenarioState, result: 'success' }
  },

  passiveRangeOfMotionAssessment: (command, scenarioState, context) => {
    return pipeHandlers(
      enrich<PerformableContext, BodyPartContext & BodyPartEffectsContext>(
        withBodyPart,
      ),
      transform((_command, scenarioState, context) => {
        const motion = scenarioUtils.getMostProminentBodyPartValue(
          context.partEffects,
          (part) => part.motion,
          MOTION_PRIORITIES,
        )

        const responseText = `You ask the patient to move their ${context.bodyPart.partName} around slowly. It is ${motion}.`

        return { responseText, scenarioState, result: 'success' }
      }),
    )(command, scenarioState, context)
  },

  activeRangeOfMotionAssessment: (command, scenarioState, context) => {
    return pipeHandlers(
      enrich<PerformableContext, BodyPartContext & BodyPartEffectsContext>(
        withBodyPart,
      ),
      transform((_command, scenarioState, context) => {
        const motion = scenarioUtils.getMostProminentBodyPartValue(
          context.partEffects,
          (part) => part.motion,
          MOTION_PRIORITIES,
        )

        // TODO: Make this response better & reflect different values than other ROM assessments
        const responseText = `You ask the patient to move their ${context.bodyPart.partName}  in a weight bearing manner. It is ${motion}.`

        return { responseText, scenarioState, result: 'success' }
      }),
    )(command, scenarioState, context)
  },

  activityRangeOfMotionAssessment: (command, scenarioState, context) => {
    return pipeHandlers(
      enrich<PerformableContext, BodyPartContext & BodyPartEffectsContext>(
        withBodyPart,
      ),
      transform((_command, scenarioState, context) => {
        const motion = scenarioUtils.getMostProminentBodyPartValue(
          context.partEffects,
          (part) => part.motion,
          MOTION_PRIORITIES,
        )

        // TODO: Make this response better & reflect different values than other ROM assessments
        const responseText = `You ask the patient to move their ${context.bodyPart.partName} in a way comensurate with the activity you are doing. It is ${motion}.`

        return { responseText, scenarioState, result: 'success' }
      }),
    )(command, scenarioState, context)
  },
}
