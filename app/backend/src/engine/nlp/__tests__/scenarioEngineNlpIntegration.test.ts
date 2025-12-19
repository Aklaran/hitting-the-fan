/**
 * BDD-Style Integration Tests for NLP + Scenario Engine
 *
 * Feature: Scenario Engine Integration
 *   As the application
 *   I want NLP parsing integrated seamlessly
 *   So users can mix natural language and exact commands
 *
 * Note: These tests focus on NLP parsing integration, not handler correctness.
 * Handler tests should use more complete scenario state fixtures.
 */

import { createTestScenarioState } from '../../__tests__/testHelpers'
import { scenarioEngine } from '../../scenarioEngine'

describe('Feature: Scenario Engine Integration', () => {
  describe('Scenario: Natural language for look commands works', () => {
    it('Given a scenario with a patient, When I submit "look at the patient" through the engine, Then it should describe the patient', async () => {
      // Given
      const scenarioState = createTestScenarioState({
        patient: {
          descriptions: {
            near: 'A test patient standing before you looking concerned',
            far: 'A person in the distance',
          },
          position: 'standing',
        },
        player: {
          distanceToPatient: 'near',
        },
      })

      // When
      const result = await scenarioEngine.processAction(
        1,
        'test-session-id',
        1,
        { action: 'look at the patient' },
        scenarioState,
      )

      // Then
      expect(result.result).toBe('success')
      expect(result.responseText).toContain('patient')
    })

    it('Given a scenario with a patient, When I submit "examine the patient" through the engine, Then NLP should parse it as look.patient', async () => {
      // Given
      const scenarioState = createTestScenarioState({
        player: {
          distanceToPatient: 'near',
        },
      })

      // When
      const result = await scenarioEngine.processAction(
        1,
        'test-session-id',
        1,
        { action: 'examine the patient' },
        scenarioState,
      )

      // Then - NLP should successfully parse this
      expect(result.result).toBe('success')
    })
  })

  describe('Scenario: Exact commands still work', () => {
    it('Given a scenario with a patient, When I submit "look patient" through the engine, Then it should describe the patient', async () => {
      // Given
      const scenarioState = createTestScenarioState({
        player: {
          distanceToPatient: 'near',
        },
      })

      // When
      const result = await scenarioEngine.processAction(
        1,
        'test-session-id',
        1,
        { action: 'look patient' },
        scenarioState,
      )

      // Then
      expect(result.result).toBe('success')
    })

    it('Given a scenario with a patient, When I submit "survey environment" through the engine, Then it should describe the scene', async () => {
      // Given
      const scenarioState = createTestScenarioState({
        environment: {
          description: 'A hiking trail with rocky terrain',
          hazards: ['loose rocks', 'steep drop'],
        },
        player: {
          distanceToPatient: 'near',
        },
      })

      // When
      const result = await scenarioEngine.processAction(
        1,
        'test-session-id',
        1,
        { action: 'survey environment' },
        scenarioState,
      )

      // Then
      expect(result.result).toBe('success')
      expect(result.responseText).toContain('hiking trail')
    })
  })

  describe('Scenario: Invalid commands get helpful feedback', () => {
    it('Given a scenario, When I submit gibberish, Then the engine should return a parse failure', async () => {
      // Given
      const scenarioState = createTestScenarioState()

      // When
      const result = await scenarioEngine.processAction(
        1,
        'test-session-id',
        1,
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
    it('Given a scenario with body parts, When I submit "look at the left arm" through the engine, Then it should examine the left arm', async () => {
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
      const result = await scenarioEngine.processAction(
        1,
        'test-session-id',
        1,
        { action: 'look at the left arm' },
        scenarioState,
      )

      // Then
      expect(result.responseText).toContain('left arm')
      expect(result.result).toBe('success')
    })
  })

  describe('Scenario: Control/stabilization natural language works', () => {
    it('Given a scenario with a patient, When I submit "hold c-spine" through the engine, Then the spine should be controlled', async () => {
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
      const result = await scenarioEngine.processAction(
        1,
        'test-session-id',
        1,
        { action: 'hold c-spine' },
        scenarioState,
      )

      // Then
      expect(result.result).toBe('success')
      expect(result.scenarioState.patient.isSpineControlled).toBe(true)
    })

    it('Given a scenario, When I submit "stabilize the spine" through the engine, Then NLP should parse it as control.spine', async () => {
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
      const result = await scenarioEngine.processAction(
        1,
        'test-session-id',
        1,
        { action: 'stabilize the spine' },
        scenarioState,
      )

      // Then
      expect(result.result).toBe('success')
      expect(result.scenarioState.patient.isSpineControlled).toBe(true)
    })
  })

  describe('Scenario: Move commands with natural language', () => {
    it('Given a scenario with patient far away, When I submit "move closer" through the engine, Then player should be near', async () => {
      // Given
      const scenarioState = createTestScenarioState({
        player: {
          distanceToPatient: 'far',
        },
      })

      // When
      const result = await scenarioEngine.processAction(
        1,
        'test-session-id',
        1,
        { action: 'move closer' },
        scenarioState,
      )

      // Then
      expect(result.result).toBe('success')
      expect(result.scenarioState.player.distanceToPatient).toBe('near')
    })
  })
})
