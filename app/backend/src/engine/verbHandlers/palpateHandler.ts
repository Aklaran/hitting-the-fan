import { Command, ScenarioState, VerbHandler } from '@shared/types/scenario'
import { scenarioUtils } from '../scenarioUtils'

export const palpateHandler: VerbHandler = {
  execute: (command: Command, scenarioState: ScenarioState): ScenarioState => {
    let responseText = 'You paw at the air. It feels like air. (NO OBJECT)'

    if (scenarioState.player.distanceToPatient === 'far') {
      return scenarioUtils.appendTooFarLogEntry(scenarioState)
    }

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

    return scenarioUtils.appendLogEntry(scenarioState, responseText, 'narrator')
  },
}
