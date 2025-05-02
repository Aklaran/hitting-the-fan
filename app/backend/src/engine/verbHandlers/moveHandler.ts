import {
  Command,
  distanceSchema,
  ScenarioState,
  VerbHandler,
  VerbResponse,
} from '@shared/types/scenario'
import { scenarioUtils } from '../scenarioUtils'

export const moveHandler: VerbHandler = {
  execute: (command: Command, scenarioState: ScenarioState): VerbResponse => {
    const responseText =
      "You cant move that. Or you can't move there. I'm truthfully not sure which you're trying to do."

    if (!scenarioUtils.isMoveTarget(command.object)) {
      return { responseText, scenarioState }
    }

    switch (command.object) {
      case 'in':
        return moveIn(scenarioState)
      case scenarioState.patient:
        return movePatient(command, scenarioState)
    }

    return { responseText, scenarioState }
  },
}

const moveIn = (scenarioState: ScenarioState): VerbResponse => {
  const responseText = `You move towards the patient.`
  scenarioState.player.distanceToPatient = distanceSchema.Enum.near
  return { responseText, scenarioState }
}

const movePatient = (
  command: Command,
  scenarioState: ScenarioState,
): VerbResponse => {
  return scenarioUtils.withDistanceCheck((command, scenarioState) => {
    let responseText = 'What position would you like to move the patient to?'

    if (!command.modifiers || !scenarioUtils.isPosition(command.modifiers[0])) {
      return { responseText, scenarioState }
    }

    const currentPosition = scenarioState.patient.position
    const newPosition = command.modifiers[0]

    if (currentPosition === newPosition) {
      responseText = `The patient is already ${currentPosition}.`
      return { responseText, scenarioState }
    }

    responseText = `You move the patient from ${currentPosition} to ${newPosition}.`

    // TODO(stretch): Check if you need to log roll the patient (e.g. supine->lateral)

    const newState = {
      ...scenarioState,
      patient: {
        ...scenarioState.patient,
        position: newPosition,
      },
    }

    return { responseText, scenarioState: newState }
  })(command, scenarioState)
}
