import {
  ActionResponse,
  Command,
  distanceSchema,
  ScenarioState,
  VerbHandler,
} from '@shared/types/scenario'
import { scenarioUtils } from '../../scenarioUtils'

export const moveHandler: VerbHandler = {
  execute: (command: Command, scenarioState: ScenarioState): ActionResponse => {
    const responseText =
      "You cant move that. Or you can't move there. I'm truthfully not sure which you're trying to do."

    if (!scenarioUtils.isMoveTarget(command.object)) {
      return { responseText, scenarioState, result: 'invalid_command' }
    }

    switch (command.object) {
      case 'in':
        return moveIn(command, scenarioState)
      case scenarioState.patient:
        return movePatient(command, scenarioState)
    }

    return { responseText, scenarioState, result: 'unexpected_error' }
  },
}

const moveIn = (
  command: Command,
  scenarioState: ScenarioState,
): ActionResponse => {
  return scenarioUtils.withDistanceCheck('far', (_, scenarioState) => {
    const responseText = `You move towards the patient.`
    scenarioState.player.distanceToPatient = distanceSchema.Enum.near
    return { responseText, scenarioState, result: 'success' }
  })(command, scenarioState)
}

const movePatient = (
  command: Command,
  scenarioState: ScenarioState,
): ActionResponse => {
  return scenarioUtils.withDistanceCheck('near', (command, scenarioState) => {
    let responseText = 'What position would you like to move the patient to?'

    if (!command.modifiers || !scenarioUtils.isPosition(command.modifiers[0])) {
      return { responseText, scenarioState, result: 'parse_failure' }
    }

    const currentPosition = scenarioState.patient.position
    const newPosition = command.modifiers[0]

    if (currentPosition === newPosition) {
      responseText = `The patient is already ${currentPosition}.`
      return { responseText, scenarioState, result: 'guard_failure' }
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

    return { responseText, scenarioState: newState, result: 'success' }
  })(command, scenarioState)
}
