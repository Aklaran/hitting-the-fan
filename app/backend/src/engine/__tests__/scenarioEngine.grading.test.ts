import { Command } from '@shared/types/scenario'
import { createTestScenarioState } from '../__tests__/testHelpers'
import { scenarioEngine } from '../scenarioEngine'

/**
 * Helper to create perfect actions by parsing action strings using scenarioState.
 * This simulates how perfectActions would be stored in scenarios.
 * Uses the same logic as createCommand to ensure consistency.
 */
const createPerfectActions = (
  actionStrings: string[],
  scenarioState: ReturnType<typeof createTestScenarioState>,
): Command[] => {
  const commands: Command[] = []
  for (const actionString of actionStrings) {
    // Parse the action string the same way createCommand does
    const tokens = actionString.split(' ')
    const verb = tokens[0].toLowerCase() as Command['verb']
    const objectName = tokens[1]

    let object: Command['object']
    
    // Resolve object the same way resolveObject does
    if (objectName === 'patient') {
      object = scenarioState.patient
    } else if (objectName === 'environment' || objectName === 'hazards') {
      object = scenarioState.environment
    } else {
      // Check if it's a body part
      const bodyPart = scenarioState.patient.bodyParts.find(
        (p) => p.partName === objectName,
      )
      if (bodyPart) {
        object = bodyPart
      } else {
        // For string targets like 'pulse', 'name', 'epipen', 'cpr', 'splint', etc.
        // These are valid CommandObject types (QuestionTarget, MeasureTarget, ApplyTarget, etc.)
        object = objectName as any
      }
    }

    // Parse modifiers (simplified - just take remaining tokens)
    const modifiers = tokens.slice(2).length > 0 ? (tokens.slice(2) as any[]) : undefined

    commands.push({
      verb,
      object,
      modifiers,
    })
  }
  return commands
}

describe('scenarioEngine.gradeActions', () => {
  describe('basic action matching', () => {
    it('should return perfect score when all actions match', () => {
      const scenarioState = createTestScenarioState({
        log: [
          { text: 'look patient', type: 'player' },
          { text: 'measure pulse', type: 'player' },
        ],
      })

      const perfectActions = createPerfectActions(
        ['look patient', 'measure pulse'],
        scenarioState,
      )

      const result = scenarioEngine.gradeActions(
        scenarioState,
        perfectActions,
      )

      expect(result.matchedActions).toBe(2)
      expect(result.totalPerfectActions).toBe(2)
      // Score is 100 (base) + 5 (order bonus) = 105
      expect(result.score).toBe(105)
      expect(result.orderBonus).toBe(5)
    })

    it('should return zero score when no actions match', () => {
      const scenarioState = createTestScenarioState({
        log: [
          { text: 'measure pulse', type: 'player' },
        ],
      })

      const perfectActions = createPerfectActions(['look patient'], scenarioState)

      const result = scenarioEngine.gradeActions(
        scenarioState,
        perfectActions,
      )

      expect(result.matchedActions).toBe(0)
      expect(result.totalPerfectActions).toBe(1)
      expect(result.score).toBe(0)
    })

    it('should return partial score when some actions match', () => {
      const scenarioState = createTestScenarioState({
        log: [
          { text: 'look patient', type: 'player' },
          { text: 'measure pulse', type: 'player' },
          { text: 'look environment', type: 'player' },
        ],
      })

      const perfectActions = createPerfectActions(
        ['look patient', 'measure pulse', 'ask name'],
        scenarioState,
      )

      const result = scenarioEngine.gradeActions(
        scenarioState,
        perfectActions,
      )

      expect(result.matchedActions).toBe(2)
      expect(result.totalPerfectActions).toBe(3)
      expect(result.score).toBeCloseTo(66.67, 1)
    })

    it('should ignore narrator entries in log', () => {
      const scenarioState = createTestScenarioState({
        log: [
          { text: 'You see a patient', type: 'narrator' },
          { text: 'look patient', type: 'player' },
          { text: 'The patient looks well', type: 'narrator' },
        ],
      })

      const perfectActions = createPerfectActions(['look patient'], scenarioState)

      const result = scenarioEngine.gradeActions(
        scenarioState,
        perfectActions,
      )

      expect(result.matchedActions).toBe(1)
      expect(result.totalPerfectActions).toBe(1)
      // Single action in order gets bonus: 100 + 5 = 105
      expect(result.score).toBe(105)
    })
  })

  describe('order detection', () => {
    it('should give order bonus when actions are in correct order', () => {
      const scenarioState = createTestScenarioState({
        log: [
          { text: 'look patient', type: 'player' },
          { text: 'measure pulse', type: 'player' },
          { text: 'ask name', type: 'player' },
        ],
      })

      const perfectActions = createPerfectActions(
        ['look patient', 'measure pulse', 'ask name'],
        scenarioState,
      )

      const result = scenarioEngine.gradeActions(
        scenarioState,
        perfectActions,
      )

      expect(result.orderBonus).toBe(5)
      expect(result.score).toBeGreaterThan(100)
    })

    it('should not give order bonus when actions are out of order', () => {
      const scenarioState = createTestScenarioState({
        log: [
          { text: 'measure pulse', type: 'player' },
          { text: 'look patient', type: 'player' },
        ],
      })

      const perfectActions = createPerfectActions(
        ['look patient', 'measure pulse'],
        scenarioState,
      )

      const result = scenarioEngine.gradeActions(
        scenarioState,
        perfectActions,
      )

      expect(result.orderBonus).toBe(0)
      expect(result.score).toBe(100)
    })

    it('should not give order bonus when not all actions match', () => {
      const scenarioState = createTestScenarioState({
        log: [
          { text: 'look patient', type: 'player' },
          { text: 'measure pulse', type: 'player' },
          { text: 'look environment', type: 'player' },
        ],
      })

      const perfectActions = createPerfectActions(
        ['look patient', 'measure pulse', 'ask name'],
        scenarioState,
      )

      const result = scenarioEngine.gradeActions(
        scenarioState,
        perfectActions,
      )

      expect(result.orderBonus).toBe(0)
    })
  })

  describe('bad actions', () => {
    it('should penalize bad actions', () => {
      const scenarioState = createTestScenarioState({
        log: [
          { text: 'look patient', type: 'player' },
          { text: 'apply splint', type: 'player' },
        ],
      })

      const perfectActions = createPerfectActions(['look patient'], scenarioState)
      // Use a different action as "bad" - applying splint when not needed
      const badActions = createPerfectActions(['apply splint'], scenarioState)

      const result = scenarioEngine.gradeActions(
        scenarioState,
        perfectActions,
        badActions,
      )

      expect(result.badActionsCount).toBe(1)
      // 100 (base) + 5 (order bonus) - 10 (bad action penalty) = 95
      expect(result.score).toBe(95)
    })

    it('should count multiple bad actions', () => {
      const scenarioState = createTestScenarioState({
        log: [
          { text: 'look patient', type: 'player' },
          { text: 'apply splint', type: 'player' },
          { text: 'perform bloodSweep', type: 'player' },
        ],
      })

      const perfectActions = createPerfectActions(['look patient'], scenarioState)
      const badActions = createPerfectActions(
        ['apply splint', 'perform bloodSweep'],
        scenarioState,
      )

      const result = scenarioEngine.gradeActions(
        scenarioState,
        perfectActions,
        badActions,
      )

      expect(result.badActionsCount).toBe(2)
      // 100 (base) + 5 (order bonus) - 20 (two bad actions) = 85
      expect(result.score).toBe(85)
    })

    it('should handle scenarios without badActions defined', () => {
      const scenarioState = createTestScenarioState({
        log: [
          { text: 'look patient', type: 'player' },
        ],
      })

      const perfectActions = createPerfectActions(['look patient'], scenarioState)

      const result = scenarioEngine.gradeActions(
        scenarioState,
        perfectActions,
      )

      expect(result.badActionsCount).toBe(0)
      // Single action in order: 100 + 5 = 105
      expect(result.score).toBe(105)
    })
  })

  describe('edge cases', () => {
    it('should handle empty log', () => {
      const scenarioState = createTestScenarioState({
        log: [],
      })

      const perfectActions = createPerfectActions(['look patient'], scenarioState)

      const result = scenarioEngine.gradeActions(
        scenarioState,
        perfectActions,
      )

      expect(result.matchedActions).toBe(0)
      expect(result.totalPerfectActions).toBe(1)
      expect(result.score).toBe(0)
    })

    it('should handle empty perfectActions', () => {
      const scenarioState = createTestScenarioState({
        log: [
          { text: 'look patient', type: 'player' },
        ],
      })

      const perfectActions: Command[] = []

      const result = scenarioEngine.gradeActions(
        scenarioState,
        perfectActions,
      )

      expect(result.matchedActions).toBe(0)
      expect(result.totalPerfectActions).toBe(0)
      expect(result.score).toBe(0)
    })

    it('should clamp score to 0-100 range', () => {
      const scenarioState = createTestScenarioState({
        log: [
          { text: 'apply splint', type: 'player' },
          { text: 'apply splint', type: 'player' },
          { text: 'apply splint', type: 'player' },
          { text: 'apply splint', type: 'player' },
          { text: 'apply splint', type: 'player' },
        ],
      })

      const perfectActions = createPerfectActions(['look patient'], scenarioState)
      const badActions = createPerfectActions(['apply splint'], scenarioState)

      const result = scenarioEngine.gradeActions(
        scenarioState,
        perfectActions,
        badActions,
      )

      expect(result.score).toBeGreaterThanOrEqual(0)
      expect(result.score).toBeLessThanOrEqual(100)
    })
  })

  describe('modifier matching', () => {
    it('should match commands with modifiers', () => {
      const scenarioState = createTestScenarioState({
        log: [
          { text: 'apply splint leftLeg tight', type: 'player' },
        ],
      })

      const perfectActions = createPerfectActions(
        ['apply splint leftLeg tight'],
        scenarioState,
      )

      const result = scenarioEngine.gradeActions(
        scenarioState,
        perfectActions,
      )

      expect(result.matchedActions).toBe(1)
      // Single action in order: 100 + 5 = 105
      expect(result.score).toBe(105)
    })

    it('should not match when modifiers differ', () => {
      const scenarioState = createTestScenarioState({
        log: [
          { text: 'apply splint leftLeg loose', type: 'player' },
        ],
      })

      const perfectActions = createPerfectActions(
        ['apply splint leftLeg tight'],
        scenarioState,
      )

      const result = scenarioEngine.gradeActions(
        scenarioState,
        perfectActions,
      )

      expect(result.matchedActions).toBe(0)
    })
  })

  describe('object matching', () => {
    it('should match patient object', () => {
      const scenarioState = createTestScenarioState({
        log: [
          { text: 'look patient', type: 'player' },
        ],
      })

      const perfectActions = createPerfectActions(['look patient'], scenarioState)

      const result = scenarioEngine.gradeActions(
        scenarioState,
        perfectActions,
      )

      expect(result.matchedActions).toBe(1)
    })

    it('should match body part objects', () => {
      const scenarioState = createTestScenarioState({
        patient: {
          bodyParts: [
            {
              partName: 'leftLeg',
              motion: 'normal',
              description: {
                obstructed: 'obstructed leg',
                unobstructed: 'unobstructed leg',
              },
              palpationResponse: '',
              obstructedState: 'unobstructed',
            },
          ],
        },
        log: [
          { text: 'look leftLeg', type: 'player' },
        ],
      })

      const perfectActions = createPerfectActions(['look leftLeg'], scenarioState)

      const result = scenarioEngine.gradeActions(
        scenarioState,
        perfectActions,
      )

      expect(result.matchedActions).toBe(1)
    })
  })

  describe('feedback', () => {
    it('should include feedback messages', () => {
      const scenarioState = createTestScenarioState({
        log: [
          { text: 'look patient', type: 'player' },
        ],
      })

      const perfectActions = createPerfectActions(['look patient'], scenarioState)

      const result = scenarioEngine.gradeActions(
        scenarioState,
        perfectActions,
      )

      expect(result.feedback).toBeInstanceOf(Array)
      expect(result.feedback.length).toBeGreaterThan(0)
    })
  })
})

