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

    const instruction = command.object

    if (hasAlreadyReceivedInstruction(scenarioState, instruction)) {
      const responseText = repeatResponseBank[instruction]
      return { responseText, scenarioState }
    }

    responseText = responseBank[instruction]

    const newState = {
      ...scenarioState,
      patient: {
        ...scenarioState.patient,
        instructions: {
          ...scenarioState.patient.instructions,
          [instruction]: true,
        },
      },
    }

    return { responseText, scenarioState: newState }
  },
}

const hasAlreadyReceivedInstruction = (
  scenarioState: ScenarioState,
  instruction: InstructTarget,
) => {
  return scenarioState.patient.instructions[instruction]
}

const responseBank: Record<InstructTarget, string> = {
  dontMove:
    'The patient nods their understanding. That might have broken their spine itself, but oh well.',
  acceptCare:
    'You inform the patient that you are a Wilderness First Responder and ask them if they would like help. They consent.',
}

const repeatResponseBank: Record<InstructTarget, string> = {
  dontMove: 'You have already instructed the patient not to move.',
  acceptCare: 'You have already obtained consent to care.',
}
