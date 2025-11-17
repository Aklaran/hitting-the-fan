import {
  ActionResponse,
  Command,
  ScenarioState,
  VerbHandler,
} from '@shared/types/scenario'
import withWearable from '../enrichers/withWearable'
import hasCommandObject from '../guards/hasCommandObject'
import isInInventory from '../guards/isInInventory'
import isNotWorn from '../guards/isNotWorn'
import { enrich, guard, pipeHandlers, transform } from '../pipeline/handlerPipe'
import { PipelineContext, WearableContext } from '../pipeline/pipelineContexts'
import wearItem from '../transformers/wearItem'

export const wearHandler: VerbHandler = {
  execute: (command: Command, scenarioState: ScenarioState): ActionResponse => {
    return pipeHandlers(
      guard(hasCommandObject),
      enrich<PipelineContext, WearableContext>(withWearable),
      guard(isNotWorn),
      guard(isInInventory),
      transform(wearItem),
    )(command, scenarioState, {})
  },
}
