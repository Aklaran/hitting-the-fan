import {
  Ailment,
  BodyPart,
  bodyPartNames,
  bodyPartSchema,
  ScenarioLogEntry,
  ScenarioState,
  Viewable,
  viewableSchema,
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

const isBodyPartName = (str: string): boolean => {
  return isSchema(bodyPartNames, str)
}

const isViewable = (obj: unknown): obj is Viewable => {
  return isSchema(viewableSchema, obj)
}

const getAilmentsByBodyPart = (ailments: Ailment[], bodyPart: BodyPart) => {
  return ailments
    .flatMap((ailment) => ailment.effects.bodyParts)
    .filter((part) => part.part === bodyPart.part)
}

export const scenarioUtils = {
  appendLogEntry,
  isBodyPart,
  isBodyPartName,
  isViewable,
  isSchema,
  getAilmentsByBodyPart,
}
