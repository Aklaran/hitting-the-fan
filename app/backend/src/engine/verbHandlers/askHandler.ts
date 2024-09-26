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

    responseText = responseBank[command.object](scenarioState)
    return { responseText, scenarioState }
  },
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
}
