import { Command, ScenarioState, VerbHandler } from '@shared/types/scenario'
import { scenarioUtils } from '../scenarioUtils'

export const palpateHandler: VerbHandler = {
  execute: (command: Command, scenarioState: ScenarioState): ScenarioState => {
    let responseText = 'You paw at the air. It feels like air. (NO OBJECT)'

    if (scenarioUtils.isBodyPart(command.object)) {
      responseText = command.object.palpationResponse

      const ailments = scenarioUtils.getAilmentsByBodyPart(
        scenarioState.patient.ailments,
        command.object,
      )

      responseText = [
        responseText,
        ...ailments.map((ailment) => ailment.palpationResponse),
      ].join(' ')
    }

    scenarioUtils.appendLogEntry(scenarioState, responseText, 'narrator')
    return scenarioState
  },
}
