import { Command, ScenarioState } from '@shared/types/scenario'
import { GuardResponse } from '../pipeline/handlerPipe'
import { WearableContext } from '../pipeline/pipelineContexts'

const isInInventory = (
  _command: Command,
  scenarioState: ScenarioState,
  context: WearableContext,
): GuardResponse => {
  return {
    didPass: scenarioState.player.inventory.includes(context.wearable),
    failureMessage: `Now if only you had ${context.wearable}...`,
  }
}

export default isInInventory
