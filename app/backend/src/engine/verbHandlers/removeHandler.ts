import {
  BodyPart,
  Command,
  obstructionSchema,
  ScenarioState,
  VerbHandler,
  VerbResponse,
} from '@shared/types/scenario'
import { TRPCError } from '@trpc/server'
import { scenarioUtils } from '../scenarioUtils'

export const removeHandler: VerbHandler = {
  execute: (command: Command, scenarioState: ScenarioState): VerbResponse => {
    let responseText = 'What would you like to remove? (NO OBJECT)'

    if (!command.object || !command.modifiers) {
      return { responseText, scenarioState }
    }

    // HACK: Just assuming that we will always want to
    // remove the first thing on the modifier list rn
    const objectToRemove = command.modifiers[0]

    if (scenarioState.player.distanceToPatient === 'far') {
      responseText = 'You are too far away to do that.'
      return { responseText, scenarioState }
    }

    if (
      !scenarioUtils.isRemoveTarget(objectToRemove) ||
      !scenarioUtils.isBodyPart(command.object)
    ) {
      responseText = `You can't remove that...`
      return { responseText, scenarioState }
    }

    return removeObstruction(command.object, scenarioState)
  },
}

const removeObstruction = (
  bodyPart: BodyPart,
  scenarioState: ScenarioState,
): VerbResponse => {
  if (bodyPart.obstructedState == obstructionSchema.Enum.unobstructed) {
    const responseText = 'The obstruction has already been removed.'
    return { responseText, scenarioState }
  }

  // FIXME: This is just making a reference to, and then destructively modifying, the old state!
  const newState = scenarioState

  const statePart = newState.patient.bodyParts.find(
    (patientPart) => patientPart.partName === bodyPart.partName,
  )

  if (!statePart) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: "Didn't find corresponding bodypart for removeHandler",
    })
  }

  statePart.obstructedState = obstructionSchema.Enum.unobstructed

  const responseText = `You remove the obstruction from ${bodyPart.partName}.`
  return { responseText, scenarioState: newState }
}
