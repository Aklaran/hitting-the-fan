import {
  ActionResponse,
  Command,
  ScenarioState,
  VerbHandler,
} from '@shared/types/scenario'
import { scenarioUtils } from '../../scenarioUtils'

export const palpateHandler: VerbHandler = {
  execute: scenarioUtils.withDistanceCheck('near', (command, scenarioState) =>
    palpateBodyPart(command, scenarioState),
  ),
}

const palpateBodyPart = (
  command: Command,
  scenarioState: ScenarioState,
): ActionResponse => {
  let responseText = 'You paw at the air. It feels like air. (NO OBJECT)'

  if (!scenarioUtils.isBodyPart(command.object)) {
    responseText = "You... probably don't want to touch that."
    return { responseText, scenarioState, result: 'invalid_command' }
  }

  if (
    ['back', 'spine'].includes(command.object.partName) &&
    scenarioState.patient.position === 'supine'
  ) {
    responseText = "You can't reach the patient's back while they are supine."
    return { responseText, scenarioState, result: 'guard_failure' }
  }

  responseText = command.object.palpationResponse

  const ailments = scenarioUtils.getAilmentEffectsByBodyPart(
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

  return { responseText, scenarioState, result: 'success' }
}
