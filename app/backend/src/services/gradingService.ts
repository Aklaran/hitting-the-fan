import { scenarioEngine } from '@backend/engine/scenarioEngine'
import {
  Command,
  Scenario,
  ScenarioState,
} from '@shared/types/scenario'
import { Grade } from '@shared/types/scenario/grade'

const gradeScenario = (
  scenarioState: ScenarioState,
  scenario: Scenario,
): Grade => {
  const { patient } = scenarioState

  // Get perfect actions and bad actions from scenario metadata
  const perfectActions: Command[] = scenario.perfectActions || []
  const badActions: Command[] | undefined = scenario.badActions

  // Grade actions using scenario engine
  const gradingResult = scenarioEngine.gradeActions(
    scenarioState,
    perfectActions,
    badActions,
  )

  // Convert score to letter grade
  let letterGrade: Grade['grade']
  if (gradingResult.score >= 90) {
    letterGrade = 'A'
  } else if (gradingResult.score >= 80) {
    letterGrade = 'B'
  } else if (gradingResult.score >= 70) {
    letterGrade = 'C'
  } else if (gradingResult.score >= 60) {
    letterGrade = 'D'
  } else {
    letterGrade = 'F'
  }

  // Combine feedback messages
  const feedback = [
    `You did a ${letterGrade === 'A' ? 'great' : letterGrade === 'B' ? 'good' : 'decent'} job treating ${patient.name}!`,
    ...gradingResult.feedback,
  ].join(' ')

  return {
    grade: letterGrade,
    feedback,
  }
}

export const gradingService = {
  gradeScenario,
}
