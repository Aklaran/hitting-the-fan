import { scenarioUtils } from '@backend/engine/scenarioUtils'
import { Command, ScenarioState } from '@shared/types/scenario'
import { OptionalActionResponse } from '../pipeline/handlerPipe'
import { AskableContext } from '../pipeline/pipelineContexts'

const withAskable = <T>(
  command: Command,
  scenarioState: ScenarioState,
  context: T,
): OptionalActionResponse<T & AskableContext> => {
  if (!scenarioUtils.isQuestionTarget(command.object)) {
    const responseText =
      "You probably don't want to ask your patient about that..."
    return { responseText, scenarioState }
  }

  return {
    command,
    scenarioState,
    context: {
      ...context,
      askable: command.object,
    },
  }
}

export default withAskable
