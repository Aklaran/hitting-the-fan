import {
  ActionResponse,
  Command,
  ScenarioState,
  VerbHandler,
} from '@shared/types/scenario'
import withControllable from '../enrichers/withControllable'
import hasCommandObject from '../guards/hasCommandObject'
import isDistanceFromPatient from '../guards/isDistanceFromPatient'
import { enrich, guard, pipeHandlers, transform } from '../pipeline/handlerPipe'
import {
  ControllableContext,
  PipelineContext,
} from '../pipeline/pipelineContexts'
import toggleSpineControl from '../transformers/toggleSpineControl'

export const controlHandler: VerbHandler = {
  execute: (command: Command, scenarioState: ScenarioState): ActionResponse => {
    return pipeHandlers(
      guard<PipelineContext>(hasCommandObject, 'no obj'),
      guard(isDistanceFromPatient('near')),
      enrich<PipelineContext, ControllableContext>(withControllable),
      transform(toggleSpineControl),
    )(command, scenarioState, {})
  },
}
