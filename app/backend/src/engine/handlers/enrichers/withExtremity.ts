import { scenarioUtils } from '@backend/engine/scenarioUtils'
import { CSMCapableBodyPart, Command, ScenarioState } from '@shared/types/scenario'
import { OptionalActionResponse } from '../pipeline/handlerPipe'

export type ExtremityContext = {
  bodyPart: CSMCapableBodyPart
  partEffects: CSMCapableBodyPart[]
}

const withExtremity = <T>(
  command: Command,
  scenarioState: ScenarioState,
  context: T,
): OptionalActionResponse<T & ExtremityContext> => {
  if (
    !command.modifiers ||
    !scenarioUtils.isExtremityName(command.modifiers[0])
  ) {
    const responseText = 'Which extremity would you like to check?'
    return { responseText, scenarioState, result: 'invalid_command' }
  }

  const partName = command.modifiers[0]

  const part = scenarioState.patient.bodyParts.find(
    (part): part is CSMCapableBodyPart => part.partName === partName,
  )

  if (!scenarioUtils.isBodyPart(part)) {
    const responseText = `The patient doesn't seem to have a ${partName}. Odd.`
    return { responseText, scenarioState, result: 'invalid_command' }
  }

  const partEffects = scenarioUtils.getEffectsOnBodyPart(
    scenarioState.patient.ailments,
    part,
  )

  return {
    command,
    scenarioState,
    context: {
      ...context,
      bodyPart: part,
      partEffects,
    },
  }
}

export default withExtremity

