/**
 * Natural Language Parser using NLP.js
 *
 * This module provides a pre-processing layer that converts natural language
 * input into exact command strings that the scenario engine can process.
 *
 * Uses a functional style with a singleton pattern for the trained model.
 */

// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./node-nlp.d.ts" />
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
 * Create a new NLP manager with default settings
 */
const createNlpManager = (): NlpManager =>
  new NlpManager({
    languages: ['en'],
    forceNER: true,
    nlu: { useNoneFeature: true },
    autoSave: false,
    autoLoad: false,
  })

/**
 * Add named entities to the NLP manager
 */
const addEntities = (manager: NlpManager): void => {
  for (const [entityType, entityMap] of Object.entries(allEntities)) {
    for (const [value, synonyms] of Object.entries(entityMap)) {
      manager.addNamedEntityText(
        entityType,
        value,
        ['en'],
        [value, ...synonyms],
      )
    }
  }
}

/**
 * Add training documents to the NLP manager
 */
const addTrainingDocuments = (manager: NlpManager): void => {
  for (const doc of allTrainingDocuments) {
    for (const utterance of doc.utterances) {
      manager.addDocument('en', utterance, doc.intent)
    }
  }

  // Add a "None" intent for gibberish/unknown input
  manager.addDocument('en', 'asdfghjkl', 'None')
  manager.addDocument('en', 'flibbertigibbet', 'None')
  manager.addDocument('en', 'random nonsense words', 'None')
}

/**
 * Create and train a new NLP manager
 */
const trainNewManager = async (): Promise<NlpManager> => {
  const manager = createNlpManager()
  addEntities(manager)
  addTrainingDocuments(manager)
  await manager.train()
  return manager
}

/**
 * Parse natural language input using a trained manager
 *
 * @param manager - A trained NLP manager
 * @param input - The natural language input from the user
 * @returns ParseResult with intent, entities, and confidence
 */
const parseWithManager = async (
  manager: NlpManager,
  input: string,
): Promise<ParseResult> => {
  const response = await manager.process('en', input.toLowerCase())

  // Extract entities from the response
  const entities: ParseResult['entities'] = []
  if (response.entities && Array.isArray(response.entities)) {
    for (const entity of response.entities) {
      entities.push({
        entity: entity.entity,
        value: entity.option || entity.utteranceText || '',
        sourceText: entity.sourceText || entity.utteranceText || '',
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
export const toCommandString = (result: ParseResult): CommandString => {
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

// ============================================================================
// Singleton Management
// ============================================================================

/** Module-level singleton for the trained NLP manager */
let trainedManager: NlpManager | null = null

/**
 * Get or create a trained NLP manager instance
 *
 * @returns Promise resolving to a trained NLP manager
 */
const getTrainedManager = async (): Promise<NlpManager> => {
  if (!trainedManager) {
    trainedManager = await trainNewManager()
  }
  return trainedManager
}

/**
 * Reset the singleton manager (useful for testing)
 */
export const resetNaturalLanguageParser = (): void => {
  trainedManager = null
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Parse natural language input
 *
 * Uses a singleton trained model for efficiency.
 *
 * @param input - The natural language input from the user
 * @returns ParseResult with intent, entities, and confidence
 *
 * @example
 * ```typescript
 * const result = await parse("check the patient's pulse")
 * // result.intent = "measure.pulse"
 * // result.confidence = 0.95
 *
 * const cmd = toCommandString(result)
 * // cmd.command = "measure pulse"
 * ```
 */
export const parse = async (input: string): Promise<ParseResult> => {
  const manager = await getTrainedManager()
  return parseWithManager(manager, input)
}

/**
 * Parse input and convert directly to a command string
 *
 * Convenience function that combines parse() and toCommandString()
 *
 * @param input - The natural language input from the user
 * @returns CommandString with the command to pass to the scenario engine
 */
export const parseToCommand = async (input: string): Promise<CommandString> => {
  const result = await parse(input)
  return toCommandString(result)
}

