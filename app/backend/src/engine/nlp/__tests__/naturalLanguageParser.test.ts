/**
 * BDD-Style Tests for Natural Language Parser
 *
 * Feature: Natural Language Intent Classification
 *   As a user practicing medical scenarios
 *   I want to type commands in natural language
 *   So that I don't need to memorize exact syntax
 */

import { NaturalLanguageParser } from '../naturalLanguageParser'

describe('Feature: Natural Language Intent Classification', () => {
  let parser: NaturalLanguageParser

  beforeAll(async () => {
    parser = new NaturalLanguageParser()
    await parser.train()
  })

  describe('Scenario: Classify measurement intents', () => {
    it('Given a trained NLP parser, When I parse "check the patient\'s pulse", Then the intent should be "measure.pulse" and confidence > 0.7', async () => {
      // When
      const result = await parser.parse("check the patient's pulse")

      // Then
      expect(result.intent).toBe('measure.pulse')
      expect(result.confidence).toBeGreaterThan(0.7)
    })

    it('Given a trained NLP parser, When I parse "what is their heart rate", Then the intent should be "measure.pulse"', async () => {
      const result = await parser.parse('what is their heart rate')

      expect(result.intent).toBe('measure.pulse')
      expect(result.confidence).toBeGreaterThan(0.7)
    })

    it('Given a trained NLP parser, When I parse "check their breathing", Then the intent should be "measure.respiration"', async () => {
      const result = await parser.parse('check their breathing')

      expect(result.intent).toBe('measure.respiration')
      expect(result.confidence).toBeGreaterThan(0.7)
    })
  })

  describe('Scenario: Classify look/examine intents', () => {
    it('Given a trained NLP parser, When I parse "look at the patient", Then the intent should be "look.patient"', async () => {
      const result = await parser.parse('look at the patient')

      expect(result.intent).toBe('look.patient')
      expect(result.confidence).toBeGreaterThan(0.7)
    })

    it('Given a trained NLP parser, When I parse "examine their left arm", Then the intent should be "look" and entity "bodypart" should be "leftArm"', async () => {
      const result = await parser.parse('examine their left arm')

      expect(result.intent).toBe('look.bodypart')
      expect(result.entities).toContainEqual(
        expect.objectContaining({ entity: 'bodypart', value: 'leftArm' }),
      )
    })

    it('Given a trained NLP parser, When I parse "what does the environment look like", Then the intent should be "look.environment"', async () => {
      const result = await parser.parse('what does the environment look like')

      expect(result.intent).toBe('look.environment')
      expect(result.confidence).toBeGreaterThan(0.7)
    })
  })

  describe('Scenario: Classify ask intents (SAMPLE questions)', () => {
    it('Given a trained NLP parser, When I parse "do you have any allergies", Then the intent should be "ask.allergies"', async () => {
      const result = await parser.parse('do you have any allergies')

      expect(result.intent).toBe('ask.allergies')
      expect(result.confidence).toBeGreaterThan(0.7)
    })

    it('Given a trained NLP parser, When I parse "what medications are you taking", Then the intent should be "ask.medications"', async () => {
      const result = await parser.parse('what medications are you taking')

      expect(result.intent).toBe('ask.medications')
      expect(result.confidence).toBeGreaterThan(0.7)
    })

    it('Given a trained NLP parser, When I parse "what is your name", Then the intent should be "ask.name"', async () => {
      const result = await parser.parse('what is your name')

      expect(result.intent).toBe('ask.name')
      expect(result.confidence).toBeGreaterThan(0.7)
    })

    it('Given a trained NLP parser, When I parse "when did you last eat", Then the intent should be "ask.lastIntakeOutput"', async () => {
      const result = await parser.parse('when did you last eat')

      expect(result.intent).toBe('ask.lastIntakeOutput')
      expect(result.confidence).toBeGreaterThan(0.7)
    })
  })

  describe('Scenario: Classify ask intents (OPQRST questions)', () => {
    it('Given a trained NLP parser, When I parse "how bad is the pain on a scale of 1 to 10", Then the intent should be "ask.severity"', async () => {
      const result = await parser.parse(
        'how bad is the pain on a scale of 1 to 10',
      )

      expect(result.intent).toBe('ask.severity')
      expect(result.confidence).toBeGreaterThan(0.7)
    })

    it('Given a trained NLP parser, When I parse "when did this start", Then the intent should be "ask.onset"', async () => {
      const result = await parser.parse('when did this start')

      expect(result.intent).toBe('ask.onset')
      expect(result.confidence).toBeGreaterThan(0.7)
    })

    it('Given a trained NLP parser, When I parse "what makes it worse", Then the intent should be "ask.provokers"', async () => {
      const result = await parser.parse('what makes it worse')

      expect(result.intent).toBe('ask.provokers')
      expect(result.confidence).toBeGreaterThan(0.7)
    })

    it('Given a trained NLP parser, When I parse "can you describe the pain", Then the intent should be "ask.quality"', async () => {
      const result = await parser.parse('can you describe the pain')

      expect(result.intent).toBe('ask.quality')
      expect(result.confidence).toBeGreaterThan(0.7)
    })
  })

  describe('Scenario: Classify control/stabilization intents', () => {
    it('Given a trained NLP parser, When I parse "hold c-spine", Then the intent should be "control.spine"', async () => {
      const result = await parser.parse('hold c-spine')

      expect(result.intent).toBe('control.spine')
      expect(result.confidence).toBeGreaterThan(0.7)
    })

    it('Given a trained NLP parser, When I parse "stabilize the spine", Then the intent should be "control.spine"', async () => {
      const result = await parser.parse('stabilize the spine')

      expect(result.intent).toBe('control.spine')
      expect(result.confidence).toBeGreaterThan(0.7)
    })

    it('Given a trained NLP parser, When I parse "manual inline stabilization", Then the intent should be "control.spine"', async () => {
      const result = await parser.parse('manual inline stabilization')

      expect(result.intent).toBe('control.spine')
      expect(result.confidence).toBeGreaterThan(0.7)
    })
  })

  describe('Scenario: Classify other verb intents', () => {
    it('Given a trained NLP parser, When I parse "palpate the chest", Then the intent should be "palpate.bodypart" with entity chest', async () => {
      const result = await parser.parse('palpate the chest')

      expect(result.intent).toBe('palpate.bodypart')
      expect(result.entities).toContainEqual(
        expect.objectContaining({ entity: 'bodypart', value: 'chest' }),
      )
    })

    it('Given a trained NLP parser, When I parse "apply a splint", Then the intent should be "apply.splint"', async () => {
      const result = await parser.parse('apply a splint')

      expect(result.intent).toBe('apply.splint')
      expect(result.confidence).toBeGreaterThan(0.7)
    })

    it('Given a trained NLP parser, When I parse "move closer", Then the intent should be "move.in"', async () => {
      const result = await parser.parse('move closer')

      expect(result.intent).toBe('move.in')
      expect(result.confidence).toBeGreaterThan(0.7)
    })

    it('Given a trained NLP parser, When I parse "do a blood sweep", Then the intent should be "perform.bloodSweep"', async () => {
      const result = await parser.parse('do a blood sweep')

      expect(result.intent).toBe('perform.bloodSweep')
      expect(result.confidence).toBeGreaterThan(0.7)
    })

    it('Given a trained NLP parser, When I parse "tell the patient not to move", Then the intent should be "instruct.dontMove"', async () => {
      const result = await parser.parse('tell the patient not to move')

      expect(result.intent).toBe('instruct.dontMove')
      expect(result.confidence).toBeGreaterThan(0.7)
    })
  })

  describe('Scenario: Handle low confidence gracefully', () => {
    it('Given a trained NLP parser, When I parse "flibbertigibbet wobble", Then the result should indicate low confidence', async () => {
      const result = await parser.parse('flibbertigibbet wobble')

      expect(result.confidence).toBeLessThan(0.7)
    })

    it('Given a trained NLP parser, When I parse gibberish, Then the original input should be preserved for fallback', async () => {
      const result = await parser.parse('flibbertigibbet wobble')

      expect(result.originalInput).toBe('flibbertigibbet wobble')
    })
  })
})

/**
 * Feature: Command String Generation
 *   As the scenario engine
 *   I need parsed intents converted to exact command syntax
 *   So the existing verb handlers can process them
 */
describe('Feature: Command String Generation', () => {
  let parser: NaturalLanguageParser

  beforeAll(async () => {
    parser = new NaturalLanguageParser()
    await parser.train()
  })

  describe('Scenario: Generate simple command', () => {
    it('Given a parsed intent "measure.pulse", When I generate a command string, Then the output should be "measure pulse"', async () => {
      // Given
      const parseResult = await parser.parse('check the pulse')

      // When
      const commandString = parser.toCommandString(parseResult)

      // Then
      expect(commandString.command).toBe('measure pulse')
      expect(commandString.wasNlpParsed).toBe(true)
    })

    it('Given a parsed intent "ask.name", When I generate a command string, Then the output should be "ask name"', async () => {
      const parseResult = await parser.parse('what is your name')
      const commandString = parser.toCommandString(parseResult)

      expect(commandString.command).toBe('ask name')
    })

    it('Given a parsed intent "control.spine", When I generate a command string, Then the output should be "control spine"', async () => {
      const parseResult = await parser.parse('hold c-spine')
      const commandString = parser.toCommandString(parseResult)

      expect(commandString.command).toBe('control spine')
    })
  })

  describe('Scenario: Generate command with body part entity', () => {
    it('Given a parsed intent "look" with entity bodypart="leftArm", When I generate a command string, Then the output should be "look leftArm"', async () => {
      const parseResult = await parser.parse('examine their left arm')
      const commandString = parser.toCommandString(parseResult)

      expect(commandString.command).toBe('look leftArm')
    })

    it('Given a parsed intent "palpate" with entity bodypart="chest", When I generate a command string, Then the output should be "palpate chest"', async () => {
      const parseResult = await parser.parse('palpate the chest')
      const commandString = parser.toCommandString(parseResult)

      expect(commandString.command).toBe('palpate chest')
    })
  })

  describe('Scenario: Preserve original on low confidence', () => {
    it('Given a low-confidence parse result for "weird input", When I generate a command string, Then the output should be "weird input"', async () => {
      const parseResult = await parser.parse('weird input')
      const commandString = parser.toCommandString(parseResult)

      // When confidence is low, preserve original input
      expect(commandString.command).toBe('weird input')
      expect(commandString.wasNlpParsed).toBe(false)
    })
  })

  describe('Scenario: Command string includes confidence', () => {
    it('Given any parse result, When I generate a command string, Then the result should include confidence score', async () => {
      const parseResult = await parser.parse('check the pulse')
      const commandString = parser.toCommandString(parseResult)

      expect(commandString.confidence).toBeDefined()
      expect(typeof commandString.confidence).toBe('number')
    })
  })
})
