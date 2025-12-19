/**
 * Type declarations for node-nlp
 *
 * node-nlp doesn't ship with TypeScript definitions,
 * so we declare the types we use here.
 */

declare module 'node-nlp' {
  export interface NlpManagerSettings {
    languages?: string[]
    forceNER?: boolean
    nlu?: {
      useNoneFeature?: boolean
    }
    autoSave?: boolean
    autoLoad?: boolean
  }

  export interface NlpEntity {
    entity: string
    option?: string
    sourceText?: string
    utteranceText?: string
    start?: number
    end?: number
    resolution?: unknown
  }

  export interface NlpResponse {
    locale: string
    utterance: string
    intent: string | null
    score: number
    domain?: string
    entities: NlpEntity[]
    answer?: string
    sentiment?: {
      score: number
      type: string
    }
  }

  export class NlpManager {
    constructor(settings?: NlpManagerSettings)

    addDocument(locale: string, utterance: string, intent: string): void
    addNamedEntityText(
      entityName: string,
      optionName: string,
      languages: string[],
      texts: string[],
    ): void
    train(): Promise<void>
    process(locale: string, utterance: string): Promise<NlpResponse>
    save(filename?: string): Promise<void>
    load(filename?: string): Promise<void>
  }
}

