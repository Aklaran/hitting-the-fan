import {
  Ailment,
  BodyPart,
  bodyPartSchema,
  Command,
  ScenarioState,
  VerbHandler,
} from '@shared/types/scenario'
import { z, ZodTypeAny } from 'zod'
import { scenarioUtils } from '../scenarioUtils'

export const palpateHandler: VerbHandler = {
  execute: (command: Command, scenarioState: ScenarioState): ScenarioState => {
    let responseText = 'You paw at the air. It feels like air. (NO OBJECT)'

    if (isBodyPart(command.object)) {
      responseText = command.object.palpationResponse

      const ailments = getAilmentsByBodyPart(
        scenarioState.patient.ailments,
        command.object,
      )

      responseText = [
        responseText,
        ...ailments.map((ailment) => ailment.palpationResponse),
      ].join(' ')
    }

    scenarioUtils.appendLogEntry(scenarioState, responseText, 'narrator')
    return scenarioState
  },
}

const getAilmentsByBodyPart = (ailments: Ailment[], bodyPart: BodyPart) => {
  return ailments
    .flatMap((ailment) => ailment.effects.bodyParts)
    .filter((part) => part.part === bodyPart.part)
}

const isBodyPart = (obj: unknown): obj is BodyPart => {
  return isSchema(bodyPartSchema, obj)
}

export function isSchema<T extends ZodTypeAny>(
  schema: T,
  obj: unknown,
): obj is z.infer<T> {
  return schema.safeParse(obj).success
}
