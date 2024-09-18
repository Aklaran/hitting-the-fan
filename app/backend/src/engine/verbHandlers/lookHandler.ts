import {
  Command,
  ScenarioLogEntry,
  ScenarioState,
  VerbHandler,
} from '@shared/types/scenario'

export const lookHandler: VerbHandler = {
  execute: (command: Command, scenarioState: ScenarioState): ScenarioState => {
    const responseText =
      command.object?.description ??
      'You stare vacantly into space. (NO OBJECT)'

    const responseLog: ScenarioLogEntry = {
      text: responseText,
      type: 'narrator',
    }

    scenarioState.log = [...scenarioState.log, responseLog]

    return scenarioState
  },
}
