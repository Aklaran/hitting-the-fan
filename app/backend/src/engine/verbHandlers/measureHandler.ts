import {
  CirculationCapableBodyPart,
  Command,
  CSMCapableBodyPart,
  MOTION_PRIORITIES,
  PULSE_QUALITY_PRIORITIES,
  ScenarioState,
  SENSATION_PRIORITIES,
  VerbHandler,
  VerbResponse,
} from '@shared/types/scenario'
import { scenarioUtils } from '../scenarioUtils'

export const measureHandler: VerbHandler = {
  execute: scenarioUtils.withDistanceCheck(
    'near',
    (command: Command, scenarioState: ScenarioState): VerbResponse => {
      let responseText = 'What do you want to measure? (NO OBJECT)'

      if (!scenarioUtils.isMeasureTarget(command.object)) {
        responseText = "You can't measure that."
        return { responseText, scenarioState }
      }

      switch (command.object) {
        case 'respiratoryRate':
          responseText = measureRespiratoryRate(scenarioState)
          break
        case 'pulse':
          responseText = withCirculationCapablePart(measurePulse)(
            command,
            scenarioState,
          )
          break
        case 'sensation':
          responseText = withExtremity(measureSensation)(command, scenarioState)
          break
        case 'motion':
          responseText = withExtremity(measureMotion)(command, scenarioState)
          break
        case 'skinTemperature':
          responseText = measureSkinTemperature(scenarioState)
          break
        case 'skinColor':
          responseText = measureSkinColor(scenarioState)
          break
        case 'skinMoisture':
          responseText = measureSkinMoisture(scenarioState)
          break

        default:
          responseText = 'What do you want to measure? (NO OBJECT)'
      }

      return { responseText, scenarioState }
    },
  ),
}

const withCirculationCapablePart = (
  handler: (
    scenarioState: ScenarioState,
    part: CirculationCapableBodyPart,
    partEffects: CirculationCapableBodyPart[],
  ) => string,
) => {
  return (command: Command, scenarioState: ScenarioState) => {
    if (
      !command.modifiers ||
      !scenarioUtils.isCirculationCapablePartName(command.modifiers[0])
    ) {
      return `Where would you like to take the pulse?`
    }

    const partName = command.modifiers[0]

    const part = scenarioState.patient.bodyParts.find(
      (part): part is CirculationCapableBodyPart => part.partName === partName,
    )

    if (!scenarioUtils.isBodyPart(part)) {
      return `The patient doesn't seem to have a ${partName}. Odd.`
    }

    const partEffects = scenarioUtils.getEffectsOnBodyPart(
      scenarioState.patient.ailments,
      part,
    )

    return handler(scenarioState, part, partEffects)
  }
}

const withExtremity = (
  handler: (
    scenarioState: ScenarioState,
    part: CSMCapableBodyPart,
    partEffects: CSMCapableBodyPart[],
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
      (part): part is CSMCapableBodyPart => part.partName === partName,
    )

    if (!scenarioUtils.isBodyPart(part)) {
      return `The patient doesn't seem to have a ${partName}. Odd.`
    }

    const partEffects = scenarioUtils.getEffectsOnBodyPart(
      scenarioState.patient.ailments,
      part,
    )

    return handler(scenarioState, part, partEffects)
  }
}

const measurePulse = (
  scenarioState: ScenarioState,
  part: CirculationCapableBodyPart,
  partEffects: CirculationCapableBodyPart[],
) => {
  const heartRate = scenarioUtils.calculateHeartRate(scenarioState.patient)

  const quality = scenarioUtils.getMostProminentValue(
    partEffects,
    (part) => part.circulation.quality,
    PULSE_QUALITY_PRIORITIES,
  )
  // TODO: Add rhythm

  return `You take the patient's pulse at the ${part.partName}. It is ${heartRate} beats per minute and ${quality}.`
}

const measureRespiratoryRate = (scenarioState: ScenarioState) => {
  const respiration = scenarioState.patient.respiration
  return `You take the patient's respiratory rate by holding your hand to their back. It is ${respiration.rate} breaths per minute, ${respiration.effort}, and ${respiration.rhythm}.`
}

const measureSensation = (
  _: ScenarioState,
  part: CSMCapableBodyPart,
  partEffects: CSMCapableBodyPart[],
) => {
  const sensation = scenarioUtils.getMostProminentValue(
    partEffects,
    (part) => part.sensation,
    SENSATION_PRIORITIES,
  )

  return `You squeeze on the patient's ${part.partName} and ask how it feels. They respond that it is ${sensation}.`
}

const measureMotion = (
  _: ScenarioState,
  part: CSMCapableBodyPart,
  partEffects: CSMCapableBodyPart[],
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

const measureSkinTemperature = (scenarioState: ScenarioState) => {
  const skinTemperature = scenarioState.patient.skin.temperature

  return `The patient's skin is ${skinTemperature}.`
}

const measureSkinMoisture = (scenarioState: ScenarioState) => {
  const skinMoisture = scenarioState.patient.skin.moisture

  return `The patient's skin is ${skinMoisture}.`
}

const measureSkinColor = (scenarioState: ScenarioState) => {
  const skinColor = scenarioState.patient.skin.color

  return `The patient's skin is ${skinColor}.`
}
