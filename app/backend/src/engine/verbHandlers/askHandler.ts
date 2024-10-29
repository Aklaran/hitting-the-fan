import {
  Command,
  QuestionTarget,
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

    if (!scenarioUtils.isQuestionTarget(command.object)) {
      responseText = `You probably don't want to ask your patient about that...`
      return { responseText, scenarioState }
    }

    return responseBank[command.object](command, scenarioState)
  },
}

const askAboutInjury = (
  command: Command,
  scenarioState: ScenarioState,
): VerbResponse => {
  let responseText = 'Please provide a body part to ask about.'
  if (
    !command.modifiers ||
    !scenarioUtils.isBodyPartName(command.modifiers[0])
  ) {
    return { responseText, scenarioState }
  }

  const bodyPartName = command.modifiers[0]

  const bodyPart = scenarioUtils.getBodyPartByName(
    scenarioState.patient.bodyParts,
    bodyPartName,
  )

  if (!bodyPart) {
    responseText = `The patient doesn't have a ${bodyPartName}. Weird.`
    return { responseText, scenarioState }
  }

  const injuries = scenarioUtils.getAilmentsByBodyPart(
    scenarioState.patient.ailments,
    bodyPart,
  )

  if (injuries.length > 0) {
    responseText = `The patient responds, "Yeah, I think I hurt my ${bodyPart.part}."`
    return { responseText, scenarioState }
  }

  responseText = `The patient responds, "No, I don't think I hurt my ${bodyPart.part}."`
  return { responseText, scenarioState }
}

const responseBank: Record<
  QuestionTarget,
  (command: Command, scenarioState: ScenarioState) => VerbResponse
> = {
  // TODO: Distance gate these (maybe make a snarky message)
  name: (_, scenarioState) => ({
    responseText: `The patient responds, "My name is ${scenarioState.patient.name}."`,
    scenarioState,
  }),
  age: (_, scenarioState) => ({
    responseText: `The patient responds, "I am ${scenarioState.patient.age} years old."`,
    scenarioState,
  }),
  gender: (_, scenarioState) => ({
    responseText: `The patient responds, "I am ${scenarioState.patient.gender}."`,
    scenarioState,
  }),
  injury: (command, scenarioState) => askAboutInjury(command, scenarioState),
}
