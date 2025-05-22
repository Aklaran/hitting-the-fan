import { scenarioUtils } from '@backend/engine/scenarioUtils'
import { Command, ScenarioState, VerbResponse } from '@shared/types/scenario'
import { WearableContext } from '../pipeline/pipelineContexts'

const wearItem = (
  _command: Command,
  scenarioState: ScenarioState,
  context: WearableContext,
): VerbResponse => {
  const responseText = `You put on the ${context.wearable}.`

  let newState = scenarioUtils.removeFromInventory(
    context.wearable,
    scenarioState,
  )

  newState = {
    ...newState,
    player: {
      ...newState.player,
      worn: [...newState.player.worn, context.wearable],
    },
  }

  return { responseText, scenarioState: newState }
}

export default wearItem
