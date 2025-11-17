import { scenarioUtils } from '@backend/engine/scenarioUtils'
import { Command, ScenarioState } from '@shared/types/scenario'
import { OptionalActionResponse } from '../pipeline/handlerPipe'
import { WearableContext } from '../pipeline/pipelineContexts'

const withWearable = <T>(
  command: Command,
  scenarioState: ScenarioState,
  context: T,
): OptionalActionResponse<T & WearableContext> => {
  if (!scenarioUtils.isWearable(command.object)) {
    const responseText = 'Now why would you want to put that on?'
    return { responseText, scenarioState, result: 'parse_failure' }
  }

  return {
    command,
    scenarioState,
    context: {
      ...context,
      wearable: command.object,
    },
  }
}

export default withWearable
