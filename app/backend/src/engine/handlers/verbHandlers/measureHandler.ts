import {
  ActionResponse,
  Command,
  MeasureTarget,
  MOTION_PRIORITIES,
  PULSE_QUALITY_PRIORITIES,
  ScenarioState,
  SENSATION_PRIORITIES,
  VerbHandler,
} from '@shared/types/scenario'
import { scenarioUtils } from '../../scenarioUtils'
import withCirculationCapableBodyPart, {
  CirculationCapableBodyPartContext,
} from '../enrichers/withCirculationCapableBodyPart'
import withExtremity, { ExtremityContext } from '../enrichers/withExtremity'
import withMeasureable from '../enrichers/withMeasureable'
import { withRealizedPatient } from '../enrichers/withRealizedPatient'
import hasCommandObject from '../guards/hasCommandObject'
import isDistanceFromPatient from '../guards/isDistanceFromPatient'
import {
  enrich,
  guard,
  Handler,
  pipeHandlers,
  transform,
} from '../pipeline/handlerPipe'
import {
  MeasureableContext,
  PipelineContext,
  RealizedPatientContext,
} from '../pipeline/pipelineContexts'

export const measureHandler: VerbHandler = {
  execute: (command: Command, scenarioState: ScenarioState): ActionResponse => {
    return pipeHandlers(
      guard<PipelineContext>(hasCommandObject),
      guard(isDistanceFromPatient('near')),
      enrich<PipelineContext, MeasureableContext>(withMeasureable),
      enrich<MeasureableContext, RealizedPatientContext>(withRealizedPatient),
      transform<MeasureableContext & RealizedPatientContext>(
        (command, scenarioState, context) => {
          return responseBank[context.measureable](
            command,
            scenarioState,
            context,
          )
        },
      ),
    )(command, scenarioState, {})
  },
}

const responseBank: Record<
  MeasureTarget,
  Handler<
    MeasureableContext & RealizedPatientContext,
    MeasureableContext & RealizedPatientContext
  >
> = {
  respiration: (command, scenarioState, context) =>
    pipeHandlers(
      transform(() => {
        const responseText = measureRespiratoryRate(scenarioState)
        return { responseText, scenarioState, result: 'success' }
      }),
    )(command, scenarioState, context),

  pulse: (command, scenarioState, context) =>
    pipeHandlers(
      enrich<MeasureableContext, CirculationCapableBodyPartContext>(
        withCirculationCapableBodyPart,
      ),
      transform((_, scenarioState, context) => {
        const responseText = measurePulse(
          scenarioState,
          context.bodyPart,
          context.partEffects,
        )
        return { responseText, scenarioState, result: 'success' }
      }),
    )(command, scenarioState, context),

  sensation: (command, scenarioState, context) =>
    pipeHandlers(
      enrich<MeasureableContext, ExtremityContext>(withExtremity),
      transform((_, scenarioState, context) => {
        const responseText = measureSensation(
          scenarioState,
          context.bodyPart,
          context.partEffects,
        )
        return { responseText, scenarioState, result: 'success' }
      }),
    )(command, scenarioState, context),

  motion: (command, scenarioState, context) =>
    pipeHandlers(
      enrich<MeasureableContext, ExtremityContext>(withExtremity),
      transform((_, scenarioState, context) => {
        const responseText = measureMotion(
          scenarioState,
          context.bodyPart,
          context.partEffects,
        )
        return { responseText, scenarioState, result: 'success' }
      }),
    )(command, scenarioState, context),

  skinTemperature: (command, scenarioState, context) =>
    pipeHandlers(
      transform(() => {
        const responseText = measureSkinTemperature(scenarioState, context)
        return { responseText, scenarioState, result: 'success' }
      }),
    )(command, scenarioState, context),

  skinColor: (command, scenarioState, context) =>
    pipeHandlers(
      transform(() => {
        const responseText = measureSkinColor(scenarioState, context)
        return { responseText, scenarioState, result: 'success' }
      }),
    )(command, scenarioState, context),

  skinMoisture: (command, scenarioState, context) =>
    pipeHandlers(
      transform(() => {
        const responseText = measureSkinMoisture(scenarioState, context)
        return { responseText, scenarioState, result: 'success' }
      }),
    )(command, scenarioState, context),

  pupils: (command, scenarioState, context) =>
    pipeHandlers(
      transform(() => {
        const responseText = measurePupils(scenarioState, context)
        return { responseText, scenarioState, result: 'success' }
      }),
    )(command, scenarioState, context),

  temperature: (command, scenarioState, context) =>
    pipeHandlers(
      transform(() => {
        const responseText = scenarioUtils.withInventoryCheck(
          measureTemperature,
        )('thermometer', scenarioState)
        return { responseText, scenarioState, result: 'success' }
      }),
    )(command, scenarioState, context),
}

const measurePulse = (
  scenarioState: ScenarioState,
  part: CirculationCapableBodyPartContext['bodyPart'],
  partEffects: CirculationCapableBodyPartContext['partEffects'],
) => {
  const heartRate = scenarioUtils.calculateHeartRate(scenarioState.patient)

  const quality = scenarioUtils.getMostProminentBodyPartValue(
    partEffects,
    (part) => part.circulation.quality,
    PULSE_QUALITY_PRIORITIES,
  )

  const rhythm = scenarioUtils.calculateHeartRhythm(scenarioState.patient)

  return `You take the patient's pulse at the ${part.partName}. It is ${heartRate} beats per minute, ${rhythm}, and ${quality}.`
}

const measureRespiratoryRate = (scenarioState: ScenarioState) => {
  const rate = scenarioUtils.calculateRespiratoryRate(scenarioState.patient)

  const rhythm = scenarioUtils.calculateRespiratoryRhythm(scenarioState.patient)

  const effort = scenarioUtils.calculateRespiratoryEffort(scenarioState.patient)

  return `You take the patient's respiratory rate by holding your hand to their back. It is ${rate} breaths per minute, ${rhythm}, and ${effort}.`
}

const measureSensation = (
  _: ScenarioState,
  part: ExtremityContext['bodyPart'],
  partEffects: ExtremityContext['partEffects'],
) => {
  const sensation = scenarioUtils.getMostProminentBodyPartValue(
    partEffects,
    (part) => part.sensation,
    SENSATION_PRIORITIES,
  )

  return `You squeeze on the patient's ${part.partName} and ask how it feels. They respond that it is ${sensation}.`
}

const measureMotion = (
  _: ScenarioState,
  part: ExtremityContext['bodyPart'],
  partEffects: ExtremityContext['partEffects'],
) => {
  const hasAilments = partEffects && partEffects.length > 0

  if (!hasAilments) {
    return `You ask the patient to move their ${part.partName}. It is ${part.motion}.`
  }

  const motion = scenarioUtils.getMostProminentBodyPartValue(
    partEffects,
    (part) => part.motion,
    MOTION_PRIORITIES,
  )

  return `You ask the patient to move their ${part.partName}. It is ${motion}.`
}

const measureSkinTemperature = (
  _: ScenarioState,
  context: RealizedPatientContext,
) => {
  return `The patient's skin is ${context.realizedPatient.skin.temperature}.`
}

const measureSkinMoisture = (
  _: ScenarioState,
  context: RealizedPatientContext,
) => {
  return `The patient's skin is ${context.realizedPatient.skin.moisture}.`
}

const measureSkinColor = (
  _: ScenarioState,
  context: RealizedPatientContext,
) => {
  return `The patient's skin is ${context.realizedPatient.skin.color}.`
}

const measurePupils = (_: ScenarioState, context: RealizedPatientContext) => {
  const equality = context.realizedPatient.pupils.equality
  const reactivity = context.realizedPatient.pupils.reactivity
  const shape = context.realizedPatient.pupils.shape

  return `You look closely at the patient's eyes and take note of the shape. They are ${shape} and ${equality}. You ask the patient to close their eyes for 5 seconds and open them again. The eyes are ${reactivity} to light.`
}

const measureTemperature = (scenarioState: ScenarioState) => {
  const temperature = scenarioUtils.calculateTemperature(scenarioState.patient)
  return `You measure the patient's temperature to be ${temperature} degrees Fahrenheit.`
}
