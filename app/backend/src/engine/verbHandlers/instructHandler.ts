import {
  Command,
  InstructTarget,
  ScenarioState,
  VerbHandler,
  VerbResponse,
} from '@shared/types/scenario'
import { scenarioUtils } from '../scenarioUtils'

export const instructHandler: VerbHandler = {
  execute: (command: Command, scenarioState: ScenarioState): VerbResponse => {
    let responseText =
      'What would you like to instruct the patient to do? (NO OBJECT)'

    if (!command.object) {
      return { responseText, scenarioState }
    }

    if (!scenarioUtils.isInstructTarget(command.object)) {
      responseText = `You probably don't want to tell your patient to do that...`
      return { responseText, scenarioState }
    }

    switch (command.object) {
      case 'dontMove':
        scenarioState = instructDontMove(scenarioState)
        break

      case 'acceptCare':
        scenarioState = instructAcceptCare(scenarioState)
        break
    }

    responseText = responseBank[command.object]
    return { responseText, scenarioState }
  },
}

const instructDontMove = (scenarioState: ScenarioState): ScenarioState => {
  return {
    ...scenarioState,
    patient: {
      ...scenarioState.patient,
      instructions: {
        ...scenarioState.patient.instructions,
        dontMove: true,
      },
    },
  }
}

const instructAcceptCare = (scenarioState: ScenarioState): ScenarioState => {
  return {
    ...scenarioState,
    patient: {
      ...scenarioState.patient,
      instructions: {
        ...scenarioState.patient.instructions,
        acceptCare: true,
      },
    },
  }
}

const responseBank: Record<InstructTarget, string> = {
  dontMove:
    'The patient nods their understanding. That might have broken their spine itself, but oh well.',
  acceptCare:
    'You inform the patient that you are a Wilderness First Responder and ask them if they would like help. They consent.',
}
