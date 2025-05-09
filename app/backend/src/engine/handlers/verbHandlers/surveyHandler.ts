import {
  Command,
  ScenarioState,
  VerbHandler,
  VerbResponse,
} from '@shared/types/scenario'

export const surveyHandler: VerbHandler = {
  execute: (command: Command, scenarioState: ScenarioState): VerbResponse => {
    let responseText = 'What would you like to survey? (NO OBJECT)'

    if (command.object === scenarioState.patient) {
      responseText = [
        scenarioState.patient.descriptions[
          scenarioState.player.distanceToPatient
        ],
        scenarioState.patient.mechanismOfInjury,
      ].join(' ')
    } else if (command.object === scenarioState.environment) {
      responseText = [
        scenarioState.environment.description,
        ...scenarioState.environment.hazards,
      ].join(' ')
    }

    return { responseText, scenarioState }
  },
}
