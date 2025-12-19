/**
 * BDD-Style Integration Tests for NLP + Scenario Engine
 *
 * Feature: Scenario Engine Integration
 *   As the application
 *   I want NLP parsing integrated seamlessly
 *   So users can mix natural language and exact commands
 */

import { createTestScenarioState } from '../../__tests__/testHelpers'
import { scenarioEngine } from '../../scenarioEngine'

describe('Feature: Scenario Engine Integration', () => {
  describe('Scenario: Natural language flows through engine', () => {
    it('Given a scenario with a patient, When I submit "what is your name" through the engine, Then the engine should process it as "ask name" and the response should contain the patient\'s name', () => {
      // Given
      const scenarioState = createTestScenarioState({
        patient: {
          name: 'John Doe',
          levelOfResponsiveness: 'AO4',
        },
        player: {
          distanceToPatient: 'near',
        },
      })

      // When
      const result = scenarioEngine.processAction(
        'test-user-id',
        'test-session-id',
        'test-scenario-id',
        { action: 'what is your name' },
        scenarioState,
      )

      // Then
      expect(result.responseText).toContain('John Doe')
      expect(result.result).toBe('success')
    })

    it('Given a scenario with a patient, When I submit "check their pulse" through the engine, Then the engine should process it as "measure pulse"', () => {
      // Given
      const scenarioState = createTestScenarioState({
        patient: {
          circulation: {
            rate: 72,
            rhythm: 'regular',
          },
        },
        player: {
          distanceToPatient: 'near',
        },
      })

      // When
      const result = scenarioEngine.processAction(
        'test-user-id',
        'test-session-id',
        'test-scenario-id',
        { action: 'check their pulse' },
        scenarioState,
      )

      // Then
      expect(result.responseText).toContain('72')
      expect(result.result).toBe('success')
    })
  })

  describe('Scenario: Exact commands still work', () => {
    it('Given a scenario with a patient, When I submit "ask name" through the engine, Then the response should contain the patient\'s name', () => {
      // Given
      const scenarioState = createTestScenarioState({
        patient: {
          name: 'Jane Smith',
          levelOfResponsiveness: 'AO4',
        },
        player: {
          distanceToPatient: 'near',
        },
      })

      // When
      const result = scenarioEngine.processAction(
        'test-user-id',
        'test-session-id',
        'test-scenario-id',
        { action: 'ask name' },
        scenarioState,
      )

      // Then
      expect(result.responseText).toContain('Jane Smith')
      expect(result.result).toBe('success')
    })

    it('Given a scenario with a patient, When I submit "measure pulse" through the engine, Then the response should contain pulse information', () => {
      // Given
      const scenarioState = createTestScenarioState({
        patient: {
          circulation: {
            rate: 80,
            rhythm: 'regular',
          },
        },
        player: {
          distanceToPatient: 'near',
        },
      })

      // When
      const result = scenarioEngine.processAction(
        'test-user-id',
        'test-session-id',
        'test-scenario-id',
        { action: 'measure pulse' },
        scenarioState,
      )

      // Then
      expect(result.responseText).toContain('80')
      expect(result.result).toBe('success')
    })
  })

  describe('Scenario: Invalid commands get helpful feedback', () => {
    it('Given a scenario with a patient, When I submit gibberish that doesn\'t match any intent, Then the engine should provide a helpful error message', () => {
      // Given
      const scenarioState = createTestScenarioState()

      // When
      const result = scenarioEngine.processAction(
        'test-user-id',
        'test-session-id',
        'test-scenario-id',
        { action: 'flibbertigibbet' },
        scenarioState,
      )

      // Then
      expect(result.result).toBe('parse_failure')
      expect(result.responseText).toBeDefined()
      expect(result.responseText.length).toBeGreaterThan(0)
    })
  })

  describe('Scenario: Body part natural language works', () => {
    it('Given a scenario with body parts, When I submit "look at the left arm" through the engine, Then it should examine the left arm', () => {
      // Given
      const scenarioState = createTestScenarioState({
        patient: {
          bodyParts: [
            {
              partName: 'leftArm',
              motion: 'normal',
              description: {
                obstructed: 'The left arm is covered by clothing',
                unobstructed: 'The left arm appears normal with no visible injuries',
              },
              palpationResponse: 'No tenderness',
              obstructedState: 'unobstructed',
            },
          ],
        },
        player: {
          distanceToPatient: 'near',
        },
      })

      // When
      const result = scenarioEngine.processAction(
        'test-user-id',
        'test-session-id',
        'test-scenario-id',
        { action: 'look at the left arm' },
        scenarioState,
      )

      // Then
      expect(result.responseText).toContain('left arm')
      expect(result.result).toBe('success')
    })
  })

  describe('Scenario: Control/stabilization natural language works', () => {
    it('Given a scenario with a patient, When I submit "hold c-spine" through the engine, Then the spine should be controlled', () => {
      // Given
      const scenarioState = createTestScenarioState({
        patient: {
          isSpineControlled: false,
          bodyParts: [
            {
              partName: 'spine',
              motion: 'normal',
              description: {
                obstructed: 'The spine is covered',
                unobstructed: 'The spine is visible',
              },
              palpationResponse: 'Normal',
              obstructedState: 'unobstructed',
            },
          ],
        },
        player: {
          distanceToPatient: 'near',
        },
      })

      // When
      const result = scenarioEngine.processAction(
        'test-user-id',
        'test-session-id',
        'test-scenario-id',
        { action: 'hold c-spine' },
        scenarioState,
      )

      // Then
      expect(result.result).toBe('success')
      expect(result.scenarioState.patient.isSpineControlled).toBe(true)
    })
  })
})

