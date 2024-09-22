import {
  BodyPart,
  Command,
  ScenarioState,
  VerbHandler,
} from '@shared/types/scenario'
import { scenarioUtils } from '../scenarioUtils'

export const lookHandler: VerbHandler = {
  execute: (command: Command, scenarioState: ScenarioState): ScenarioState => {
    let responseText = 'You stare vacantly into space. (NO OBJECT)'

    if (scenarioUtils.isBodyPart(command.object)) {
      responseText = lookAtBodyPart(command.object, scenarioState)
    } else if (scenarioUtils.isViewable(command.object)) {
      responseText = command.object.description
    }

    scenarioUtils.appendLogEntry(scenarioState, responseText, 'narrator')
    return scenarioState
  },
}

const lookAtBodyPart = (bodyPart: BodyPart, scenarioState: ScenarioState) => {
  let responseText = bodyPart.description

  const ailments = scenarioUtils.getAilmentsByBodyPart(
    scenarioState.patient.ailments,
    bodyPart,
  )

  responseText = [
    responseText,
    ...ailments.map((ailment) => ailment.description),
  ].join(' ')

  return responseText
}
