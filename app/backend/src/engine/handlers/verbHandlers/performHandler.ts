import {
  Command,
  PerformTarget,
  ScenarioState,
  VerbHandler,
  VerbResponse,
} from '@shared/types/scenario'
import withPerformable from '../enrichers/withPerformable'
import hasCommandObject from '../guards/hasCommandObject'
import isDistanceFromPatient from '../guards/isDistanceFromPatient'
import { enrich, guard, pipeHandlers, transform } from '../pipeline/handlerPipe'
import {
  PerformableContext,
  PipelineContext,
} from '../pipeline/pipelineContexts'

export const performHandler: VerbHandler = {
  execute: (command: Command, scenarioState: ScenarioState): VerbResponse => {
    return pipeHandlers(
      guard<PipelineContext>(hasCommandObject),
      guard(isDistanceFromPatient('near')),
      enrich<PipelineContext, PerformableContext>(withPerformable),
      transform((_, scenarioState, context) =>
        procedures[context.performable](scenarioState),
      ),
    )(command, scenarioState, {})
  },
}

const procedures: Record<
  PerformTarget,
  (scenarioState: ScenarioState) => VerbResponse
> = {
  bloodSweep: (scenarioState) => {
    let responseText =
      "You run your hands around the outside of the patient's clothing and under them to find major bleeds."
    const majorBleeds = scenarioState.patient.ailments.filter(
      (ailment) => ailment.effects.bleed === 'major',
    )

    if (!majorBleeds || majorBleeds.length === 0) {
      responseText += ' You do not find any concerning amounts of blood.'
      return { responseText, scenarioState }
    }

    // TODO: Make a util function to create a grammatically correct comma-separated list
    const bleedLocations = majorBleeds
      .flatMap((bleed) => bleed.effects.bodyParts)
      .map((bodyPart) => bodyPart.partName)
      .join(', ')

    responseText += ` You find concerning amounts of blood on the ${bleedLocations}.`
    return { responseText, scenarioState }
  },
}
