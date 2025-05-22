import { Command, ScenarioState } from '@shared/types/scenario'
import { GuardResponse } from '../pipeline/handlerPipe'
import { WearableContext } from '../pipeline/pipelineContexts'

const isNotWorn = (
  _command: Command,
  scenarioState: ScenarioState,
  context: WearableContext,
): GuardResponse => {
  return {
    didPass: !scenarioState.player.worn.includes(context.wearable),
    failureMessage: `You're already wearing ${context.wearable}`,
  }
}

export default isNotWorn
