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
    } else if (command.object === scenarioState.patient) {
      responseText = lookAtPatient(scenarioState)
    } else if (scenarioUtils.isViewable(command.object)) {
      responseText = command.object.description
    }

    return scenarioUtils.appendLogEntry(scenarioState, responseText, 'narrator')
  },
}

const lookAtBodyPart = (bodyPart: BodyPart, scenarioState: ScenarioState) => {
  if (scenarioState.player.distanceToPatient === 'far') {
    return 'You are too far away to see the details.'
  }

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

const lookAtPatient = (scenarioState: ScenarioState) => {
  return scenarioState.patient.descriptions[
    scenarioState.player.distanceToPatient
  ]
}
