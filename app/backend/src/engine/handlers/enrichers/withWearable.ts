import { scenarioUtils } from '@backend/engine/scenarioUtils'
import { Command, ScenarioState } from '@shared/types/scenario'
import { OptionalVerbResponse } from '../pipeline/handlerPipe'
import { WearableContext } from '../pipeline/pipelineContexts'

const withWearable = <T>(
  command: Command,
  scenarioState: ScenarioState,
  context: T,
): OptionalVerbResponse<T & WearableContext> => {
  if (!scenarioUtils.isWearable(command.object)) {
    const responseText = 'Now why would you want to put that on?'
    return { responseText, scenarioState }
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
