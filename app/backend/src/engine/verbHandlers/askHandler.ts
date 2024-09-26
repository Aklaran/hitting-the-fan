import { Command, ScenarioState, VerbHandler } from '@shared/types/scenario'
import { scenarioUtils } from '../scenarioUtils'

export const askHandler: VerbHandler = {
  execute: (command: Command, scenarioState: ScenarioState): ScenarioState => {
    let responseText = 'What would you like to ask? (NO OBJECT)'

    if (!scenarioUtils.isQuestionTarget(command.object)) {
      responseText = `You probably don't want to ask your patient about that...`
    }

    if (command.object === 'name') {
      responseText = `The patient responds, "My name is ${scenarioState.patient.name}."`
    } else if (command.object === 'age') {
      responseText = `The patient responds, "I am ${scenarioState.patient.age} years old."`
    } else if (command.object === 'gender') {
      responseText = `The patient responds, "I am ${scenarioState.patient.gender}."`
    }

    return scenarioUtils.appendLogEntry(scenarioState, responseText, 'narrator')
  },
}
