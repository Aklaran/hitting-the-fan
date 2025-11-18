import { scenarioUtils } from '@backend/engine/scenarioUtils'
import { Command, ScenarioState } from '@shared/types/scenario'
import { OptionalActionResponse } from '../pipeline/handlerPipe'
import { PerformableContext } from '../pipeline/pipelineContexts'

const withPerformable = <T>(
  command: Command,
  scenarioState: ScenarioState,
  context: T,
): OptionalActionResponse<T & PerformableContext> => {
  if (!scenarioUtils.isPerformTarget(command.object)) {
    const responseText = "You don't know how to perform that."
    return { responseText, scenarioState, result: 'invalid_command' }
  }

  return {
    command,
    scenarioState,
    context: {
      ...context,
      performable: command.object,
    },
  }
}

export default withPerformable
