import {
  Ailment,
  BodyPart,
  BodyPartName,
  bodyPartNames,
  bodyPartSchema,
  QuestionTarget,
  questionTargetSchema,
  ScenarioLogEntry,
  ScenarioState,
  scenarioStateSchema,
  Viewable,
  viewableSchema,
} from '@shared/types/scenario'
import logger from '@shared/util/logger'
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
  const result = schema.safeParse(obj)

  if (!result.success) {
    logger.debug(`isSchema returning false because: ${result.error.message}`)
    return false
  }

  return result.success
}

const isScenarioState = (obj: unknown): obj is ScenarioState => {
  return isSchema(scenarioStateSchema, obj)
}

const isBodyPart = (obj: unknown): obj is BodyPart => {
  return isSchema(bodyPartSchema, obj)
}

const isBodyPartName = (str: string): str is BodyPartName => {
  return isSchema(bodyPartNames, str)
}

const isViewable = (obj: unknown): obj is Viewable => {
  return isSchema(viewableSchema, obj)
}

const isQuestionTarget = (obj: unknown): obj is QuestionTarget => {
  return isSchema(questionTargetSchema, obj)
}

const getAilmentsByBodyPart = (ailments: Ailment[], bodyPart: BodyPart) => {
  return ailments
    .flatMap((ailment) => ailment.effects.bodyParts)
    .filter((part) => part.part === bodyPart.part)
}

export const scenarioUtils = {
  appendLogEntry,
  isScenarioState,
  isBodyPart,
  isBodyPartName,
  isViewable,
  isSchema,
  isQuestionTarget,
  getAilmentsByBodyPart,
}
