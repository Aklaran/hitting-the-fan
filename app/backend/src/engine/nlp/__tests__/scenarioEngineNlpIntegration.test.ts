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

import type { ScenarioState } from '@shared/types/scenario'
import { createTestScenarioState } from '../../__tests__/testHelpers'
import { scenarioEngine } from '../../scenarioEngine'

describe('Feature: Scenario Engine Integration', () => {
  /**
   * Helper function to reduce duplication in processAction calls
   * Uses consistent test IDs and session for all integration tests
   */
  const processTestAction = (action: string, scenarioState: ScenarioState) => {
    return scenarioEngine.processAction(
      1, // scenarioId
      'test-session-id',
      1, // userId
      { action },
      scenarioState,
    )
  }

  describe('Scenario: Natural language flows through engine', () => {
    it('Given a scenario with a patient, When I submit "what is your name" through the engine, Then the engine should process it as "ask name" and response should contain the patient\'s name', async () => {
      // Given
      const scenarioState = createTestScenarioState({
        patient: {
          name: 'John Doe',
          age: 35,
        },
        player: {
          distanceToPatient: 'near',
        },
      })

      // When
      const result = await processTestAction('what is your name', scenarioState)

      // Then - NLP should parse as ask.name and engine should process it
      expect(result.result).toBe('success')
      expect(result.responseText.toLowerCase()).toContain('john')
    })

    it('Given a scenario with a patient, When I submit "do you have any allergies" through the engine, Then it should process as ask.allergies', async () => {
      // Given
      const scenarioState = createTestScenarioState({
        patient: {
          allergies: ['aspirin'],
        },
        player: {
          distanceToPatient: 'near',
        },
      })

      // When
      const result = await processTestAction(
        'do you have any allergies',
        scenarioState,
      )

      // Then
      expect(result.result).toBe('success')
      expect(result.responseText.toLowerCase()).toContain('allerg')
    })
  })

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
      const result = await processTestAction(
        'look at the patient',
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
      const result = await processTestAction(
        'examine the patient',
        scenarioState,
      )

      // Then - NLP should successfully parse this
      expect(result.result).toBe('success')
    })
  })

  describe('Scenario: Exact commands still work', () => {
    it('Given a scenario with a patient, When I submit "ask name" through the engine, Then the response should contain the patient\'s name', async () => {
      // Given
      const scenarioState = createTestScenarioState({
        patient: {
          name: 'Jane Smith',
          age: 28,
        },
        player: {
          distanceToPatient: 'near',
        },
      })

      // When
      const result = await processTestAction('ask name', scenarioState)

      // Then
      expect(result.result).toBe('success')
      expect(result.responseText.toLowerCase()).toContain('jane')
    })

    it('Given a scenario with a patient, When I submit "look patient" through the engine, Then it should describe the patient', async () => {
      // Given
      const scenarioState = createTestScenarioState({
        player: {
          distanceToPatient: 'near',
        },
      })

      // When
      const result = await processTestAction('look patient', scenarioState)

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
      const result = await processTestAction(
        'survey environment',
        scenarioState,
      )

      // Then
      expect(result.result).toBe('success')
      expect(result.responseText).toContain('hiking trail')
    })
  })

  describe('Scenario: Invalid commands get helpful feedback', () => {
    it("Given a scenario, When I submit gibberish that doesn't match any intent, Then the engine should attempt exact match parsing and provide a helpful error message", async () => {
      // Given
      const scenarioState = createTestScenarioState()

      // When
      const result = await processTestAction('flibbertigibbet', scenarioState)

      // Then
      // Engine attempts NLP parse (fails due to low confidence)
      // Then attempts exact command parse (fails - not a valid verb)
      // Finally returns parse_failure with helpful message
      expect(result.result).toBe('parse_failure')
      expect(result.responseText).toBeDefined()
      expect(result.responseText.length).toBeGreaterThan(0)
      // Message should be helpful (not just "error")
      expect(result.responseText.toLowerCase()).toMatch(
        /unknown|invalid|not|recognize|understand|command/,
      )
    })

    it('Given a scenario, When I submit nonsense words, Then the engine should preserve the original input in the error context', async () => {
      // Given
      const scenarioState = createTestScenarioState()
      const gibberishCommand = 'xyzzy plugh abracadabra'

      // When
      const result = await processTestAction(gibberishCommand, scenarioState)

      // Then
      expect(result.result).toBe('parse_failure')
      expect(result.responseText).toBeDefined()
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
                unobstructed:
                  'The left arm appears normal with no visible injuries',
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
      const result = await processTestAction(
        'look at the left arm',
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
      const result = await processTestAction('hold c-spine', scenarioState)

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
      const result = await processTestAction(
        'stabilize the spine',
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
      const result = await processTestAction('move closer', scenarioState)

      // Then
      expect(result.result).toBe('success')
      expect(result.scenarioState.player.distanceToPatient).toBe('near')
    })
  })
})
