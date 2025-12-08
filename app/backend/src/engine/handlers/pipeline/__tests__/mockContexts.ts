import {
  BasicPartName,
  ControlTarget,
  MeasureTarget,
  PerformTarget,
  QuestionTarget,
  Wearable,
} from '@shared/types/scenario'
import {
  AilmentContext,
  AilmentsContext,
  ApplicableContext,
  AskableContext,
  BodyPartContext,
  BodyPartEffectsContext,
  ControllableContext,
  InjuryContext,
  MeasureableContext,
  MedicalTagsContext,
  PerformableContext,
  PipelineContext,
  RealizedPatientContext,
  WearableContext,
} from '../pipelineContexts'

/**
 * Mock context helpers for testing handlers.
 * These functions create valid context objects that satisfy the pipeline context types.
 */

export const createMockPipelineContext = (): PipelineContext => ({})

export const createMockWearableContext = (
  wearable: Wearable = 'gloves',
): WearableContext => ({
  wearable,
})

export const createMockControllableContext = (
  partName: ControlTarget['partName'] = 'spine',
): ControllableContext => ({
  controllable: {
    partName,
    motion: 'normal',
    description: {
      obstructed: `The ${partName} is covered`,
      unobstructed: `The ${partName} is exposed`,
    },
    palpationResponse: `You palpate the ${partName}`,
    obstructedState: 'obstructed',
  },
})

export const createMockAskableContext = (
  askable: QuestionTarget = 'name',
): AskableContext => ({
  askable,
})

export const createMockMedicalTagsContext = (
  description = 'Test medical tag',
): MedicalTagsContext => ({
  medicalTags: {
    description,
  },
})

export const createMockBodyPartContext = (
  partName: BasicPartName = 'chest',
): BodyPartContext => ({
  bodyPart: {
    partName,
    motion: 'normal',
    description: {
      obstructed: `The ${partName} is covered`,
      unobstructed: `The ${partName} is exposed`,
    },
    palpationResponse: `You palpate the ${partName}`,
    obstructedState: 'obstructed',
  },
})

export const createMockApplicableContext = (): ApplicableContext => ({
  applicable: 'splint',
})

export const createMockAilmentContext = (
  ailmentName = 'Test Ailment',
): AilmentContext => ({
  ailment: {
    name: ailmentName,
    description: 'A test ailment',
    isChiefComplaint: false,
    mechanismOfInjury: 'Unknown',
    provokers: 'Unknown',
    palliatives: 'Unknown',
    quality: 'Unknown',
    region: 'Unknown',
    radiation: 'Unknown',
    referral: 'Unknown',
    severity: 'Unknown',
    onsetTime: 'Unknown',
    intensityTrend: 'Unknown',
    normality: 'Unknown',
    happenedBefore: 'Unknown',
    effects: {
      circulation: {
        heartRateModifier: 0,
        rateModifierType: 'additive',
        rhythm: 'regular',
      },
      respiration: {
        respiratoryRateModifier: 0,
        rateModifierType: 'additive',
        rhythm: 'regular',
        effort: 'easy',
      },
      skin: {
        color: 'pink',
        temperature: 'warm',
        moisture: 'dry',
      },
      pupils: {
        shape: 'round',
        equality: 'equal',
        reactivity: 'reactive',
      },
      temperature: {
        temperatureModifier: 0,
        rateModifierType: 'additive',
      },
      bleed: 'none',
      levelOfResponsiveness: 'AO4',
      bodyParts: [],
    },
    possibleTreatments: [],
    appliedTreatments: [],
  },
})

export const createMockAilmentsContext = (
  ailmentNames: string[] = ['Test Ailment'],
): AilmentsContext => ({
  ailments: ailmentNames.map((name) => createMockAilmentContext(name).ailment),
})

export const createMockBodyPartEffectsContext = (): BodyPartEffectsContext => ({
  partEffects: [],
})

export const createMockInjuryContext = (): InjuryContext => ({
  injuries: [],
})

export const createMockPerformableContext = (
  performable: PerformTarget = 'bloodSweep',
): PerformableContext => ({
  performable,
})

export const createMockMeasureableContext = (
  measureable: MeasureTarget = 'respiration',
): MeasureableContext => ({
  measureable,
})

export const createMockRealizedPatientContext = (): RealizedPatientContext => ({
  realizedPatient: {
    name: 'Test Patient',
    descriptions: {
      near: 'A test patient',
      far: 'A test patient in the distance',
    },
    age: 30,
    gender: 'male',
    temperatureFahrenheit: 98.6,
    circulation: {
      rate: 80,
      rhythm: 'regular',
    },
    respiration: {
      rate: 16,
      rhythm: 'regular',
      effort: 'easy',
    },
    skin: {
      color: 'pink',
      temperature: 'warm',
      moisture: 'dry',
    },
    pupils: {
      shape: 'round',
      equality: 'equal',
      reactivity: 'reactive',
    },
    levelOfResponsiveness: 'AO4',
    bodyParts: [],
    ailments: [],
    instructions: {
      dontMove: false,
      acceptCare: true,
      breathe: true,
    },
    isSpineControlled: false,
    events: '',
    position: 'standing',
    allergies: [],
    medications: [],
    lastIntakeOutput: 'Unknown',
    hasDiabetes: false,
    hasAsthma: false,
    hasSeizures: false,
    hasHeartConditions: false,
  },
})
