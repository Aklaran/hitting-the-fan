import { scenarioUtils } from '@backend/engine/scenarioUtils'
import { Command, ScenarioState } from '@shared/types/scenario'
import { OptionalActionResponse } from '../pipeline/handlerPipe'
import { BodyPartContext } from '../pipeline/pipelineContexts'

const withBodyPart = <T>(
  command: Command,
  scenarioState: ScenarioState,
  context: T,
): OptionalActionResponse<T & BodyPartContext> => {
  if (
    !command.modifiers ||
    !scenarioUtils.isBodyPartName(command.modifiers[0])
  ) {
    const responseText = 'Please provide a body part to ask about.'
    return { responseText, scenarioState }
  }

  const bodyPartName = command.modifiers[0]

  const bodyPart = scenarioUtils.getBodyPartByName(
    scenarioState.patient.bodyParts,
    bodyPartName,
  )

  if (!bodyPart) {
    const responseText = `The patient doesn't have a ${bodyPartName}. Weird.`
    return { responseText, scenarioState }
  }

  return {
    command,
    scenarioState,
    context: {
      ...context,
      bodyPart,
    },
  }
}

export default withBodyPart
