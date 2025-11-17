import {
  ActionResponse,
  Command,
  ScenarioState,
  VerbHandler,
} from '@shared/types/scenario'

export const surveyHandler: VerbHandler = {
  execute: (command: Command, scenarioState: ScenarioState): ActionResponse => {
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
