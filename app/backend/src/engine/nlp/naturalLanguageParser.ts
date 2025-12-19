/**
 * Natural Language Parser using NLP.js
 *
 * This module provides a pre-processing layer that converts natural language
 * input into exact command strings that the scenario engine can process.
 */

import { NlpManager } from 'node-nlp'

import { allEntities } from './entities'
import { allTrainingDocuments } from './trainingData'

/**
 * Result of parsing natural language input
 */
export interface ParseResult {
  /** The classified intent (e.g., "measure.pulse", "ask.name") */
  intent: string | null
  /** Extracted entities (e.g., body parts, modifiers) */
  entities: Array<{ entity: string; value: string; sourceText: string }>
  /** Confidence score from 0 to 1 */
  confidence: number
  /** The original input text */
  originalInput: string
}

/**
 * Result of converting a parse result to a command string
 */
export interface CommandString {
  /** The command string to pass to the scenario engine */
  command: string
  /** Whether the command was parsed via NLP (true) or fell back to original (false) */
  wasNlpParsed: boolean
  /** The confidence score of the parse */
  confidence: number
}

/** Minimum confidence threshold to use NLP parse result */
const CONFIDENCE_THRESHOLD = 0.7

/**
 * Natural Language Parser
 *
 * Converts natural language user input into exact command strings
 * that the scenario engine can process.
 *
 * @example
 * ```typescript
 * const parser = new NaturalLanguageParser()
 * await parser.train()
 *
 * const result = await parser.parse("check the patient's pulse")
 * // result.intent = "measure.pulse"
 * // result.confidence = 0.95
 *
 * const cmd = parser.toCommandString(result)
 * // cmd.command = "measure pulse"
 * ```
 */
export class NaturalLanguageParser {
  private manager: NlpManager
  private trained: boolean = false

  constructor() {
    this.manager = new NlpManager({
      languages: ['en'],
      forceNER: true,
      nlu: { useNoneFeature: true },
      autoSave: false,
      autoLoad: false,
    })
  }

  /**
   * Train the NLP model with intents and entities
   */
  async train(): Promise<void> {
    if (this.trained) {
      return
    }

    // Add named entities
    this.addEntities()

    // Add training documents
    this.addTrainingDocuments()

    // Train the model
    await this.manager.train()
    this.trained = true
  }

  /**
   * Parse natural language input
   *
   * @param input - The natural language input from the user
   * @returns ParseResult with intent, entities, and confidence
   */
  async parse(input: string): Promise<ParseResult> {
    if (!this.trained) {
      throw new Error('Parser not trained. Call train() first.')
    }

    const response = await this.manager.process('en', input.toLowerCase())

    // Extract entities from the response
    const entities: ParseResult['entities'] = []
    if (response.entities && Array.isArray(response.entities)) {
      for (const entity of response.entities) {
        entities.push({
          entity: entity.entity,
          value: entity.option || entity.utteranceText,
          sourceText: entity.sourceText || entity.utteranceText,
        })
      }
    }

    return {
      intent: response.intent || null,
      entities,
      confidence: response.score || 0,
      originalInput: input,
    }
  }

  /**
   * Convert a parse result to a command string
   *
   * @param result - The parse result from parse()
   * @returns CommandString with the command to pass to the scenario engine
   */
  toCommandString(result: ParseResult): CommandString {
    // If confidence is below threshold, fall back to original input
    if (result.confidence < CONFIDENCE_THRESHOLD || !result.intent) {
      return {
        command: result.originalInput,
        wasNlpParsed: false,
        confidence: result.confidence,
      }
    }

    // Parse the intent into verb and object
    const [verb, object] = result.intent.split('.')

    // Build the command string
    let command = verb

    // Handle special cases where we need to extract from entities
    if (object === 'bodypart') {
      // Look for a body part entity
      const bodyPartEntity = result.entities.find((e) => e.entity === 'bodypart')
      if (bodyPartEntity) {
        command = `${verb} ${bodyPartEntity.value}`
      } else {
        // Fall back to original if we can't find the body part
        return {
          command: result.originalInput,
          wasNlpParsed: false,
          confidence: result.confidence,
        }
      }
    } else if (object) {
      // Simple verb + object command
      command = `${verb} ${object}`
    }

    // Add modifiers from entities
    const modifierEntity = result.entities.find((e) => e.entity === 'modifier')
    if (modifierEntity) {
      command = `${command} ${modifierEntity.value}`
    }

    return {
      command,
      wasNlpParsed: true,
      confidence: result.confidence,
    }
  }

  /**
   * Add named entities to the NLP manager
   */
  private addEntities(): void {
    for (const [entityType, entityMap] of Object.entries(allEntities)) {
      for (const [value, synonyms] of Object.entries(entityMap)) {
        // Add the value itself as a synonym
        this.manager.addNamedEntityText(entityType, value, ['en'], [value, ...synonyms])
      }
    }
  }

  /**
   * Add training documents to the NLP manager
   */
  private addTrainingDocuments(): void {
    for (const doc of allTrainingDocuments) {
      for (const utterance of doc.utterances) {
        this.manager.addDocument('en', utterance, doc.intent)
      }
    }

    // Add a "None" intent for gibberish/unknown input
    this.manager.addDocument('en', 'asdfghjkl', 'None')
    this.manager.addDocument('en', 'flibbertigibbet', 'None')
    this.manager.addDocument('en', 'random nonsense words', 'None')
  }
}

// Singleton instance for reuse
let parserInstance: NaturalLanguageParser | null = null

/**
 * Get or create a trained NLP parser instance
 *
 * @returns Promise resolving to a trained NaturalLanguageParser
 */
export async function getNaturalLanguageParser(): Promise<NaturalLanguageParser> {
  if (!parserInstance) {
    parserInstance = new NaturalLanguageParser()
    await parserInstance.train()
  }
  return parserInstance
}

/**
 * Reset the parser singleton (useful for testing)
 */
export function resetNaturalLanguageParser(): void {
  parserInstance = null
}

