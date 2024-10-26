import {
  Command,
  ScenarioState,
  VerbHandler,
  VerbResponse,
} from '@shared/types/scenario'
import { scenarioUtils } from '../scenarioUtils'

export const controlHandler: VerbHandler = {
  execute: (command: Command, scenarioState: ScenarioState): VerbResponse => {
    let responseText = 'What would you like to control? (NO OBJECT)'

    if (!command.object) {
      return { responseText, scenarioState }
    }

    if (scenarioState.player.distanceToPatient === 'far') {
      responseText = 'You are too far away to do that.'
      return { responseText, scenarioState }
    }

    if (!scenarioUtils.isControlTarget(command.object)) {
      responseText = `You can't control that...`
      return { responseText, scenarioState }
    }

    return applySpineControl(scenarioState)
  },
}

const applySpineControl = (scenarioState: ScenarioState): VerbResponse => {
  if (scenarioState.patient.isSpineControlled) {
    const responseText = "You are already controlling the patient's spine."
    return { responseText, scenarioState }
  }

  const newState = {
    ...scenarioState,
    patient: {
      ...scenarioState.patient,
      isSpineControlled: true,
    },
  }

  const responseText =
    "You manually immobilize the patient's head with your backpacks."
  return { responseText, scenarioState: newState }
}

