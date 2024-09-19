import { Command, ScenarioState, VerbHandler } from '@shared/types/scenario'
import { scenarioUtils } from '../scenarioUtils'

export const lookHandler: VerbHandler = {
  execute: (command: Command, scenarioState: ScenarioState): ScenarioState => {
    const responseText =
      command.object?.description ??
      'You stare vacantly into space. (NO OBJECT)'

    scenarioUtils.appendLogEntry(scenarioState, responseText, 'narrator')
    return scenarioState
  },
}
