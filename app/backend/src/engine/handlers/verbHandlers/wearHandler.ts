import {
  Command,
  ScenarioState,
  VerbHandler,
  VerbResponse,
} from '@shared/types/scenario'
import withWearable from '../enrichers/withWearable'
import hasCommandObject from '../guards/hasCommandObject'
import isInInventory from '../guards/isInInventory'
import isNotWorn from '../guards/isNotWorn'
import { enrich, guard, pipeHandlers, transform } from '../pipeline/handlerPipe'
import { PipelineContext, WearableContext } from '../pipeline/pipelineContexts'
import wearItem from '../transformers/wearItem'

export const wearHandler: VerbHandler = {
  execute: (command: Command, scenarioState: ScenarioState): VerbResponse => {
    return pipeHandlers(
      guard(hasCommandObject, `${command.object} doesn't exist here.`),
      enrich<PipelineContext, WearableContext>(withWearable),
      guard(isNotWorn, `You're already wearing a ${command.object}.`),
      guard(isInInventory, `Now if only you had a ${command.object}...`),
      transform(wearItem),
    )(command, scenarioState, {})
  },
}
