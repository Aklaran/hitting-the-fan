import {
  ActionResponse,
  BodyPart,
  Command,
  obstructionSchema,
  ScenarioState,
  VerbHandler,
} from '@shared/types/scenario'
import { TRPCError } from '@trpc/server'
import { scenarioUtils } from '../../scenarioUtils'

export const removeHandler: VerbHandler = {
  execute: (command: Command, scenarioState: ScenarioState): ActionResponse => {
    let responseText = 'What would you like to remove? (NO OBJECT)'

    if (!command.object || !command.modifiers) {
      return { responseText, scenarioState, result: 'parse_failure' }
    }

    // HACK: Just assuming that we will always want to
    // remove the first thing on the modifier list rn
    const objectToRemove = command.modifiers[0]

    if (scenarioState.player.distanceToPatient === 'far') {
      responseText = 'You are too far away to do that.'
      return { responseText, scenarioState, result: 'guard_failure' }
    }

    if (
      !scenarioUtils.isRemoveTarget(objectToRemove) ||
      !scenarioUtils.isBodyPart(command.object)
    ) {
      responseText = `You can't remove that...`
      return { responseText, scenarioState, result: 'invalid_command' }
    }

    return removeObstruction(command.object, scenarioState)
  },
}

const removeObstruction = (
  bodyPart: BodyPart,
  scenarioState: ScenarioState,
): ActionResponse => {
  if (bodyPart.obstructedState == obstructionSchema.Enum.unobstructed) {
    const responseText = 'The obstruction has already been removed.'
    return { responseText, scenarioState, result: 'guard_failure' }
  }

  // Find the body part to ensure it exists before creating new state
  const statePart = scenarioState.patient.bodyParts.find(
    (patientPart) => patientPart.partName === bodyPart.partName,
  )

  if (!statePart) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: "Didn't find corresponding bodypart for removeHandler",
    })
  }

  // Create immutable copy with updated obstruction state
  const newState: ScenarioState = {
    ...scenarioState,
    patient: {
      ...scenarioState.patient,
      bodyParts: scenarioState.patient.bodyParts.map((part) =>
        part.partName === bodyPart.partName
          ? { ...part, obstructedState: obstructionSchema.Enum.unobstructed }
          : part,
      ),
    },
  }

  const responseText = `You remove the obstruction from ${bodyPart.partName}.`
  return { responseText, scenarioState: newState, result: 'success' }
}
