import { Command, ScenarioState } from '@shared/types/scenario'
import { WearableContext } from '../pipeline/pipelineContexts'

const isNotWorn = (
  _command: Command,
  scenarioState: ScenarioState,
  context: WearableContext,
) => {
  return !scenarioState.player.worn.includes(context.wearable)
}

export default isNotWorn
