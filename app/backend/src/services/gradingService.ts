import { ScenarioState } from '@shared/types/scenario'
import { Grade } from '@shared/types/scenario/grade'

const gradeScenario = (scenarioState: ScenarioState): Grade => {
  const { patient } = scenarioState

  return {
    grade: 'A',
    feedback: `You did a great job treating ${patient.name}!`,
  }
}

export const gradingService = {
  gradeScenario,
}
