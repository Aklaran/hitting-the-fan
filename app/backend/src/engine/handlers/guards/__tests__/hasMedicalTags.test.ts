import {
  createTestCommand,
  createTestScenarioState,
} from '../../../__tests__/testHelpers'
import hasMedicalTags from '../hasMedicalTags'

describe('hasMedicalTags guard', () => {
  const mockCommand = createTestCommand()
  const mockContext = {}

  it('should pass when patient has medical tags', () => {
    const scenarioState = createTestScenarioState({
      patient: {
        medicalTag: { description: 'Diabetes Type 2' },
      },
    })

    const result = hasMedicalTags(mockCommand, scenarioState, mockContext)

    expect(result.didPass).toBe(true)
    expect(result.failureMessage).toBe(
      'The patient does not have medical tags.',
    )
  })

  it('should fail when patient does not have medical tags', () => {
    const scenarioState = createTestScenarioState()

    const result = hasMedicalTags(mockCommand, scenarioState, mockContext)

    expect(result.didPass).toBe(false)
    expect(result.failureMessage).toBe(
      'The patient does not have medical tags.',
    )
  })

  it('should always return the same failure message', () => {
    const scenarioState = createTestScenarioState()

    const result = hasMedicalTags(mockCommand, scenarioState, mockContext)

    expect(result.failureMessage).toBe(
      'The patient does not have medical tags.',
    )
  })
})
