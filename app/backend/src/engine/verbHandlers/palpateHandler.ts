import {
  Command,
  ScenarioState,
  VerbHandler,
  VerbResponse,
} from '@shared/types/scenario'
import { scenarioUtils } from '../scenarioUtils'

export const palpateHandler: VerbHandler = {
  execute: (command: Command, scenarioState: ScenarioState): VerbResponse => {
    let responseText = 'You paw at the air. It feels like air. (NO OBJECT)'

    if (scenarioState.player.distanceToPatient === 'far') {
      responseText = 'You are too far away to do that.'
      return { responseText, scenarioState }
    }

    if (scenarioUtils.isBodyPart(command.object)) {
      responseText = command.object.palpationResponse

      const ailments = scenarioUtils.getAilmentsByBodyPart(
        scenarioState.patient.ailments,
        command.object,
      )

      if (ailments && ailments.length > 0) {
        responseText = [
          responseText,
          ...ailments.map((ailment) => ailment.palpationResponse),
        ].join(' ')
      } else {
        responseText += ' Everything feels normal.'
      }
    }

    return { responseText, scenarioState }
  },
}
