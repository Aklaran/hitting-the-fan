import {
  createTestCommand,
  createTestScenarioState,
} from '../../../__tests__/testHelpers'
import { createMockControllableContext } from '../../pipeline/__tests__/mockContexts'
import toggleSpineControl from '../toggleSpineControl'

describe('toggleSpineControl', () => {
  const mockContext = createMockControllableContext('spine')

  describe('applying spine control', () => {
    it('should apply spine control when not already controlled', () => {
      const command = createTestCommand({ verb: 'control' })
      const scenarioState = createTestScenarioState({
        patient: { isSpineControlled: false },
      })

      const result = toggleSpineControl(command, scenarioState, mockContext)

      expect(result.result).toBe('success')
      expect(result.scenarioState.patient.isSpineControlled).toBe(true)
      expect(result.responseText).toBe(
        "You manually immobilize the patient's head with your backpacks.",
      )
    })

    it('should fail when spine is already controlled', () => {
      const command = createTestCommand({ verb: 'control' })
      const scenarioState = createTestScenarioState({
        patient: { isSpineControlled: true },
      })

      const result = toggleSpineControl(command, scenarioState, mockContext)

      expect(result.result).toBe('guard_failure')
      expect(result.scenarioState.patient.isSpineControlled).toBe(true)
      expect(result.responseText).toBe(
        "You are already controlling the patient's spine.",
      )
    })
  })

  describe('removing spine control', () => {
    it('should remove spine control when currently controlled', () => {
      const command = createTestCommand({
        verb: 'control',
        modifiers: ['remove'],
      })
      const scenarioState = createTestScenarioState({
        patient: { isSpineControlled: true },
      })

      const result = toggleSpineControl(command, scenarioState, mockContext)

      expect(result.result).toBe('success')
      expect(result.scenarioState.patient.isSpineControlled).toBe(false)
      expect(result.responseText).toBe(
        "You release your hold on the patient's head and allow them to move.",
      )
    })

    it('should fail when spine is not controlled', () => {
      const command = createTestCommand({
        verb: 'control',
        modifiers: ['remove'],
      })
      const scenarioState = createTestScenarioState({
        patient: { isSpineControlled: false },
      })

      const result = toggleSpineControl(command, scenarioState, mockContext)

      expect(result.result).toBe('guard_failure')
      expect(result.scenarioState.patient.isSpineControlled).toBe(false)
      expect(result.responseText).toBe(
        "You aren't controlling the patient's spine.",
      )
    })
  })

  describe('state immutability', () => {
    it('should not mutate the original state when applying control', () => {
      const command = createTestCommand({ verb: 'control' })
      const scenarioState = createTestScenarioState({
        patient: { isSpineControlled: false },
      })

      const result = toggleSpineControl(command, scenarioState, mockContext)

      expect(scenarioState.patient.isSpineControlled).toBe(false)
      expect(result.scenarioState.patient.isSpineControlled).toBe(true)
      expect(result.scenarioState).not.toBe(scenarioState)
    })
  })
})
