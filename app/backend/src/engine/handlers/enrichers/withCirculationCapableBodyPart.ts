import { scenarioUtils } from '@backend/engine/scenarioUtils'
import { CirculationCapableBodyPart, Command, ScenarioState } from '@shared/types/scenario'
import { OptionalActionResponse } from '../pipeline/handlerPipe'

export type CirculationCapableBodyPartContext = {
  bodyPart: CirculationCapableBodyPart
  partEffects: CirculationCapableBodyPart[]
}

const withCirculationCapableBodyPart = <T>(
  command: Command,
  scenarioState: ScenarioState,
  context: T,
): OptionalActionResponse<T & CirculationCapableBodyPartContext> => {
  if (
    !command.modifiers ||
    !scenarioUtils.isCirculationCapablePartName(command.modifiers[0])
  ) {
    const responseText = 'Where would you like to take the pulse?'
    return { responseText, scenarioState, result: 'invalid_command' }
  }

  const partName = command.modifiers[0]

  const part = scenarioState.patient.bodyParts.find(
    (part): part is CirculationCapableBodyPart => part.partName === partName,
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

export default withCirculationCapableBodyPart

