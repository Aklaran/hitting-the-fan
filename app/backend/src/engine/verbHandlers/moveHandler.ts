import {
  Command,
  distanceSchema,
  ScenarioState,
  VerbHandler,
  VerbResponse,
} from '@shared/types/scenario'

export const moveHandler: VerbHandler = {
  execute: (command: Command, scenarioState: ScenarioState): VerbResponse => {
    let responseText = 'Where would you like to move? (NO OBJECT)'

    if (command.object === 'in') {
      responseText = `You move towards the patient.`
      scenarioState.player.distanceToPatient = distanceSchema.Enum.near
    }

    return { responseText, scenarioState }
  },
}
