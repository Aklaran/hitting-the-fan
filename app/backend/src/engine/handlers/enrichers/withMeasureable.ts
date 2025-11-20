import { scenarioUtils } from '@backend/engine/scenarioUtils'
import { Command, ScenarioState } from '@shared/types/scenario'
import { OptionalActionResponse } from '../pipeline/handlerPipe'
import { MeasureableContext } from '../pipeline/pipelineContexts'

const withMeasureable = <T>(
  command: Command,
  scenarioState: ScenarioState,
  context: T,
): OptionalActionResponse<T & MeasureableContext> => {
  if (!scenarioUtils.isMeasureTarget(command.object)) {
    const responseText = "You don't know how to measure that."
    return { responseText, scenarioState, result: 'invalid_command' }
  }

  return {
    command,
    scenarioState,
    context: {
      ...context,
      measureable: command.object,
    },
  }
}

export default withMeasureable
