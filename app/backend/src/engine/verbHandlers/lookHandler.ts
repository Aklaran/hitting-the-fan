import { Command, ScenarioState, VerbHandler } from '@shared/types/scenario'
import { scenarioUtils } from '../scenarioUtils'

export const lookHandler: VerbHandler = {
  execute: (command: Command, scenarioState: ScenarioState): ScenarioState => {
    let responseText =
      command.object?.description ??
      'You stare vacantly into space. (NO OBJECT)'

    if (scenarioUtils.isBodyPart(command.object)) {
      responseText = command.object.description

      const ailments = scenarioUtils.getAilmentsByBodyPart(
        scenarioState.patient.ailments,
        command.object,
      )

      responseText = [
        responseText,
        ...ailments.map((ailment) => ailment.description),
      ].join(' ')
    }

    scenarioUtils.appendLogEntry(scenarioState, responseText, 'narrator')
    return scenarioState
  },
}
