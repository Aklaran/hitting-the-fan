import {
  ActionResponse,
  BodyPart,
  Command,
  ScenarioState,
  VerbHandler,
} from '@shared/types/scenario'
import { scenarioUtils } from '../../scenarioUtils'

export const lookHandler: VerbHandler = {
  execute: (command: Command, scenarioState: ScenarioState): ActionResponse => {
    let responseText = 'You stare vacantly into space. (NO OBJECT)'

    if (scenarioUtils.isBodyPart(command.object)) {
      responseText = lookAtBodyPart(command.object, scenarioState)
    } else if (command.object === scenarioState.patient) {
      responseText = lookAtPatient(scenarioState)
    } else if (scenarioUtils.isViewable(command.object)) {
      responseText = command.object.description
    }

    return { responseText, scenarioState, result: 'success' }
  },
}

const lookAtBodyPart = (bodyPart: BodyPart, scenarioState: ScenarioState) => {
  if (scenarioState.player.distanceToPatient === 'far') {
    return 'You are too far away to see the details.'
  }

  let responseText = bodyPart.description[bodyPart.obstructedState]

  const ailments = scenarioUtils.getAilmentEffectsByBodyPart(
    scenarioState.patient.ailments,
    bodyPart,
  )

  responseText = [
    responseText,
    ...ailments.map((ailment) => ailment.description[bodyPart.obstructedState]),
  ].join(' ')

  return responseText
}

const lookAtPatient = (scenarioState: ScenarioState) => {
  const description =
    scenarioState.patient.descriptions[scenarioState.player.distanceToPatient]

  const position = scenarioState.patient.position

  return description + ` The patient is ${position}.`
}
