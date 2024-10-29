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

    responseText = responseBank[instruction](scenarioState)

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

const responseBank: Record<
  InstructTarget,
  (scenarioState: ScenarioState) => string
> = {
  dontMove: () =>
    'The patient nods their understanding. That might have broken their spine itself, but oh well.',
  acceptCare: () =>
    'You inform the patient that you are a Wilderness First Responder and ask them if they would like help. They consent.',
  breathe: (scenarioState) => {
    // TODO: Distance gate this
    const respiration = scenarioState.patient.respiration

    return `You instruct the patient to take 2 deep breathes and place your hand on the back to feel them. They are ${respiration.effort} and ${respiration.rhythm}.`
  },
}

const repeatResponseBank: Record<InstructTarget, string> = {
  dontMove: 'You have already instructed the patient not to move.',
  acceptCare: 'You have already obtained consent to care.',
  breathe: 'You have already checked that the patient can breathe.',
}
