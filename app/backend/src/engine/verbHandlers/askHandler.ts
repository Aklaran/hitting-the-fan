import {
  Command,
  QuestionTarget,
  questionTargetSchema,
  ScenarioState,
  VerbHandler,
  VerbResponse,
} from '@shared/types/scenario'
import { scenarioUtils } from '../scenarioUtils'

export const askHandler: VerbHandler = {
  execute: (command: Command, scenarioState: ScenarioState): VerbResponse => {
    let responseText = 'What would you like to ask? (NO OBJECT)'

    if (!command.object) {
      return { responseText, scenarioState }
    }

    if (command.object === questionTargetSchema.Enum.injury) {
      responseText = askAboutInjury(command, scenarioState)
      return { responseText, scenarioState }
    }

    if (!scenarioUtils.isQuestionTarget(command.object)) {
      responseText = `You probably don't want to ask your patient about that...`
      return { responseText, scenarioState }
    }

    responseText = responseBank[command.object](scenarioState)
    return { responseText, scenarioState }
  },
}

const askAboutInjury = (
  command: Command,
  scenarioState: ScenarioState,
): string => {
  if (
    !command.modifiers ||
    !scenarioUtils.isBodyPartName(command.modifiers[0])
  ) {
    return 'Please provide a body part to ask about.'
  }

  const bodyPartName = command.modifiers[0]

  const bodyPart = scenarioUtils.getBodyPartByName(
    scenarioState.patient.bodyParts,
    bodyPartName,
  )

  if (!bodyPart) {
    return `The patient doesn't have a ${bodyPartName}. Weird.`
  }

  const injuries = scenarioUtils.getAilmentsByBodyPart(
    scenarioState.patient.ailments,
    bodyPart,
  )

  if (injuries.length > 0) {
    return `The patient responds, "Yeah, I think I hurt my ${bodyPart.part}."`
  }

  return `The patient responds, "No, I don't think I hurt my ${bodyPart.part}."`
}

const responseBank: Record<
  QuestionTarget,
  (scenarioState: ScenarioState) => string
> = {
  name: (scenarioState) =>
    `The patient responds, "My name is ${scenarioState.patient.name}."`,
  age: (scenarioState) =>
    `The patient responds, "I am ${scenarioState.patient.age} years old."`,
  gender: (scenarioState) =>
    `The patient responds, "I am ${scenarioState.patient.gender}."`,
  injury: () => `What injury would you like to ask about?`,
}
