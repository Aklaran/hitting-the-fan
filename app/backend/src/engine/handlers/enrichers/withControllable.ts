import { scenarioUtils } from '@backend/engine/scenarioUtils'
import { Command, ScenarioState } from '@shared/types/scenario'
import { OptionalActionResponse } from '../pipeline/handlerPipe'
import { ControllableContext } from '../pipeline/pipelineContexts'

const withControllable = <T>(
  command: Command,
  scenarioState: ScenarioState,
  context: T,
): OptionalActionResponse<T & ControllableContext> => {
  if (!scenarioUtils.isControlTarget(command.object)) {
    const responseText = `You can't control that.`
    return { responseText, scenarioState, result: 'guard_failure' }
  }

  return {
    command,
    scenarioState,
    context: {
      ...context,
      controllable: command.object,
    },
  }
}

export default withControllable
