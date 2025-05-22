import { Command, ScenarioState } from '@shared/types/scenario'
import { WearableContext } from '../pipeline/pipelineContexts'

const isInInventory = (
  _command: Command,
  scenarioState: ScenarioState,
  context: WearableContext,
) => {
  return scenarioState.player.inventory.includes(context.wearable)
}

export default isInInventory
