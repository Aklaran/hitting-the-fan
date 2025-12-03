import { scenarioUtils } from '@backend/engine/scenarioUtils'
import { Command, ScenarioState } from '@shared/types/scenario'
import { OptionalActionResponse } from '../pipeline/handlerPipe'
import { ApplicableContext } from '../pipeline/pipelineContexts'

const withApplicable = <T>(
  command: Command,
  scenarioState: ScenarioState,
  context: T,
): OptionalActionResponse<T & ApplicableContext> => {
  if (!scenarioUtils.isApplyTarget(command.object)) {
    const responseText =
      "You probably don't want to apply that to your patient..."
    return { responseText, scenarioState, result: 'invalid_command' }
  }

  return {
    command,
    scenarioState,
    context: {
      ...context,
      applicable: command.object,
    },
  }
}

export default withApplicable
