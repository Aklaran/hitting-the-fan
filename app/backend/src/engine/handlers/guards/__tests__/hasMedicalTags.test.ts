import { Command, ScenarioState } from '@shared/types/scenario'
import hasMedicalTags from '../hasMedicalTags'

describe('hasMedicalTags guard', () => {
  const mockCommand: Command = {
    verb: 'look',
  }

  const mockContext = {}

  const createMockScenarioState = (hasMedicalTag: boolean): ScenarioState => {
    return {
      log: [],
      player: {
        distanceToPatient: 'near',
        inventory: [],
        worn: [],
        notes: '',
        soapNote: '',
      },
      patient: {
        name: 'John Doe',
        descriptions: {
          near: 'A 30-year-old male standing',
          far: 'A person standing',
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
        medicalTag: hasMedicalTag
          ? { description: 'Diabetes Type 2' }
          : undefined,
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
        description: 'A quiet room',
        temperatureCelsius: 20,
        hazards: [],
        time: '12:00',
        place: 'A room',
      },
      possibleGlobalTreatments: [],
      globalTreatmentsApplied: [],
    }
  }

  it('should pass when patient has medical tags', () => {
    const scenarioState = createMockScenarioState(true)

    const result = hasMedicalTags(mockCommand, scenarioState, mockContext)

    expect(result.didPass).toBe(true)
    expect(result.failureMessage).toBe(
      'The patient does not have medical tags.',
    )
  })

  it('should fail when patient does not have medical tags', () => {
    const scenarioState = createMockScenarioState(false)

    const result = hasMedicalTags(mockCommand, scenarioState, mockContext)

    expect(result.didPass).toBe(false)
    expect(result.failureMessage).toBe(
      'The patient does not have medical tags.',
    )
  })

  it('should always return the same failure message', () => {
    const scenarioState = createMockScenarioState(false)

    const result = hasMedicalTags(mockCommand, scenarioState, mockContext)

    expect(result.failureMessage).toBe(
      'The patient does not have medical tags.',
    )
  })
})
