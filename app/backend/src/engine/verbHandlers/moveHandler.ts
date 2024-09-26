import {
  Command,
  distanceSchema,
  ScenarioState,
  VerbHandler,
} from '@shared/types/scenario'
import { scenarioUtils } from '../scenarioUtils'

export const moveHandler: VerbHandler = {
  execute: (command: Command, scenarioState: ScenarioState): ScenarioState => {
    let responseText = 'Where would you like to move? (NO OBJECT)'

    if (command.object === 'in') {
      responseText = `You move towards the patient.`
      scenarioState.player.distanceToPatient = distanceSchema.Enum.near
    }

    scenarioUtils.appendLogEntry(scenarioState, responseText, 'narrator')
    return scenarioState
  },
}
