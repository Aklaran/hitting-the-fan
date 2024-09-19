import {
  Ailment,
  BodyPart,
  bodyPartSchema,
  ScenarioLogEntry,
  ScenarioState,
} from '@shared/types/scenario'
import { z, ZodTypeAny } from 'zod'

const appendLogEntry = (
  scenarioState: ScenarioState,
  text: string,
  type: 'narrator' | 'player',
) => {
  const logEntry: ScenarioLogEntry = {
    text,
    type,
  }

  scenarioState.log = [...scenarioState.log, logEntry]
  return scenarioState
}

const isSchema = <T extends ZodTypeAny>(
  schema: T,
  obj: unknown,
): obj is z.infer<T> => {
  return schema.safeParse(obj).success
}

const isBodyPart = (obj: unknown): obj is BodyPart => {
  return isSchema(bodyPartSchema, obj)
}

const getAilmentsByBodyPart = (ailments: Ailment[], bodyPart: BodyPart) => {
  return ailments
    .flatMap((ailment) => ailment.effects.bodyParts)
    .filter((part) => part.part === bodyPart.part)
}

export const scenarioUtils = {
  appendLogEntry,
  isBodyPart,
  isSchema,
  getAilmentsByBodyPart,
}
