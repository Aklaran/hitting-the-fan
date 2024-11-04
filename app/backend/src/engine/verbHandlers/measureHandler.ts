import {
  Command,
  Extremity,
  MOTION_PRIORITIES,
  PULSE_QUALITY_PRIORITIES,
  ScenarioState,
  SENSATION_PRIORITIES,
  VerbHandler,
  VerbResponse,
} from '@shared/types/scenario'
import { scenarioUtils } from '../scenarioUtils'

export const measureHandler: VerbHandler = {
  execute: (command: Command, scenarioState: ScenarioState): VerbResponse => {
    let responseText = 'What do you want to measure? (NO OBJECT)'

    if (scenarioState.player.distanceToPatient === 'far') {
      responseText = 'You are too far away to do that.'
      return { responseText, scenarioState }
    }

    switch (command.object) {
      case 'respiratoryRate':
        responseText = measureRespiratoryRate(scenarioState)
        break
      case 'pulse':
        responseText = withExtremity(measurePulse)(command, scenarioState)
        break
      case 'sensation':
        responseText = withExtremity(measureSensation)(command, scenarioState)
        break
      case 'motion':
        responseText = withExtremity(measureMotion)(command, scenarioState)
        break
      default:
        responseText = 'What do you want to measure? (NO OBJECT)'
    }

    return { responseText, scenarioState }
  },
}

const withExtremity = (
  handler: (
    scenarioState: ScenarioState,
    part: Extremity,
    partEffects: Extremity[],
  ) => string,
) => {
  return (command: Command, scenarioState: ScenarioState) => {
    if (
      !command.modifiers ||
      !scenarioUtils.isExtremityName(command.modifiers[0])
    ) {
      return `Where would you like to take the pulse?`
    }

    const partName = command.modifiers[0]

    const part = scenarioState.patient.bodyParts.find(
      (part): part is Extremity => part.partName === partName,
    )

    if (!scenarioUtils.isBodyPart(part)) {
      return `The patient doesn't seem to have a ${partName}. Odd.`
    }

    // TODO: How are we going to prioritize/mix the effects of multiple ailments on these measurements?
    const partEffects = scenarioUtils.getAilmentsByBodyPart(
      scenarioState.patient.ailments,
      part,
    )

    return handler(scenarioState, part, partEffects)
  }
}

const measurePulse = (
  scenarioState: ScenarioState,
  part: Extremity,
  partEffects: Extremity[],
) => {
  // TODO: Allow measurement of pulse at the neck

  // TODO: multiply heart rate by all the ailments, not just the one affecting this body part
  const baseRate = scenarioState.patient.circulation.rate

  const hasAilments = partEffects && partEffects.length > 0

  if (!hasAilments) {
    return `You take the patient's pulse at the ${part.partName}. It is ${baseRate} beats per minute.`
  }

  const quality = scenarioUtils.getMostProminentValue(
    partEffects,
    (part) => part.circulation.quality,
    PULSE_QUALITY_PRIORITIES,
  )
  // TODO: Add rhythm

  return `You take the patient's pulse at the wrist. It is ${baseRate} beats per minute and ${quality}.`
}

const measureRespiratoryRate = (scenarioState: ScenarioState) => {
  const respiration = scenarioState.patient.respiration
  return `You take the patient's respiratory rate by holding your hand to their back. It is ${respiration.rate} breaths per minute, ${respiration.effort}, and ${respiration.rhythm}.`
}

const measureSensation = (
  _: ScenarioState,
  part: Extremity,
  partEffects: Extremity[],
) => {
  const hasAilments = partEffects && partEffects.length > 0

  if (!hasAilments) {
    return `You squeeze on the patient's ${part.partName} and ask how it feels. They respond that it is ${part.sensation}.`
  }

  const sensation = scenarioUtils.getMostProminentValue(
    partEffects,
    (part) => part.sensation,
    SENSATION_PRIORITIES,
  )

  return `You squeeze on the patient's ${part.partName} and ask how it feels. They respond that it is ${sensation}.`
}

const measureMotion = (
  _: ScenarioState,
  part: Extremity,
  partEffects: Extremity[],
) => {
  const hasAilments = partEffects && partEffects.length > 0

  if (!hasAilments) {
    return `You ask the patient to move their ${part.partName}. It is ${part.motion}.`
  }

  const motion = scenarioUtils.getMostProminentValue(
    partEffects,
    (part) => part.motion,
    MOTION_PRIORITIES,
  )

  return `You ask the patient to move their ${part.partName}. It is ${motion}.`
}
