/* eslint-disable no-extra-semi */
import { Command, ScenarioState } from '@shared/types/scenario'

/**
 * Deep partial type that makes all properties optional recursively
 */
type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

/**
 * Creates a minimal valid ScenarioState with sensible defaults.
 * All fields can be overridden via the partial parameter.
 *
 * @example
 * // Create state with medical tag
 * const state = createTestScenarioState({
 *   patient: { medicalTag: { description: 'Diabetes' } }
 * })
 *
 * @example
 * // Create state with custom vitals
 * const state = createTestScenarioState({
 *   patient: {
 *     circulation: { rate: 120, rhythm: 'irregular' }
 *   }
 * })
 */
export function createTestScenarioState(
  overrides?: DeepPartial<ScenarioState>,
): ScenarioState {
  const defaults: ScenarioState = {
    log: [],
    player: {
      distanceToPatient: 'near',
      inventory: [],
      worn: [],
      notes: '',
      soapNote: '',
    },
    patient: {
      name: 'Test Patient',
      descriptions: {
        near: 'A test patient standing near you',
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
    environment: {
      description: 'A test environment',
      temperatureCelsius: 20,
      hazards: [],
      time: '12:00',
      place: 'Test location',
    },
    possibleGlobalTreatments: [],
    globalTreatmentsApplied: [],
  }

  return deepMerge(defaults, overrides || {}) as ScenarioState
}

/**
 * Creates a minimal valid Command with sensible defaults.
 *
 * @example
 * const cmd = createTestCommand({ verb: 'look', object: 'patient' })
 */
export function createTestCommand(overrides?: Partial<Command>): Command {
  const defaults: Command = {
    verb: 'look',
  }

  return { ...defaults, ...overrides }
}

/**
 * Deep merge utility that recursively merges objects
 */
function deepMerge<T>(target: T, source: DeepPartial<T>): T {
  const output = { ...target }

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      const sourceValue = source[key as keyof typeof source]
      const targetValue = target[key as keyof T]

      if (isObject(sourceValue) && isObject(targetValue)) {
        ;(output as Record<string, unknown>)[key] = deepMerge(
          targetValue,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          sourceValue as any,
        )
      } else if (sourceValue !== undefined) {
        ;(output as Record<string, unknown>)[key] = sourceValue
      }
    })
  }

  return output
}

function isObject(item: unknown): item is Record<string, unknown> {
  return item !== null && typeof item === 'object' && !Array.isArray(item)
}
