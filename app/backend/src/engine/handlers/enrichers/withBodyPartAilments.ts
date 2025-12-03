import { scenarioUtils } from '@backend/engine/scenarioUtils'
import { Command, ScenarioState } from '@shared/types/scenario'
import { OptionalActionResponse } from '../pipeline/handlerPipe'
import { AilmentsContext } from '../pipeline/pipelineContexts'

const withBodyPartAilments = <T>(
  command: Command,
  scenarioState: ScenarioState,
  context: T,
): OptionalActionResponse<T & AilmentsContext> => {
  if (
    !command.modifiers ||
    !scenarioUtils.isBodyPartName(command.modifiers[0])
  ) {
    const responseText = 'Please provide a body part to ask about.'
    return { responseText, scenarioState, result: 'invalid_command' }
  }

  const bodyPartName = command.modifiers[0]

  const bodyPart = scenarioUtils.getBodyPartByName(
    scenarioState.patient.bodyParts,
    bodyPartName,
  )

  if (!bodyPart) {
    const responseText = `The patient doesn't have a ${bodyPartName}. Weird.`
    return { responseText, scenarioState, result: 'invalid_command' }
  }

  const ailments = scenarioUtils.getAilmentsByBodyPart(
    scenarioState.patient.ailments,
    bodyPart,
  )

  return {
    command,
    scenarioState,
    context: {
      ...context,
      ailments,
    },
  }
}

export default withBodyPartAilments
