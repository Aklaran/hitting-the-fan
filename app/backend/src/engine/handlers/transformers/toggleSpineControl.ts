import { Command, ScenarioState, VerbResponse } from '@shared/types/scenario'
import { ControllableContext } from '../pipeline/pipelineContexts'

const controlSpine = (
  command: Command,
  scenarioState: ScenarioState,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _context: ControllableContext,
): VerbResponse => {
  if (command.modifiers && command.modifiers.includes('remove')) {
    return removeSpineControl(scenarioState)
  }

  return applySpineControl(scenarioState)
}

export default controlSpine

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

const removeSpineControl = (scenarioState: ScenarioState): VerbResponse => {
  if (!scenarioState.patient.isSpineControlled) {
    const responseText = "You aren't controlling the patient's spine."
    return { responseText, scenarioState }
  }

  const newState = {
    ...scenarioState,
    patient: {
      ...scenarioState.patient,
      isSpineControlled: false,
    },
  }

  const responseText =
    "You release your hold on the patient's head and allow them to move."
  return { responseText, scenarioState: newState }
}
