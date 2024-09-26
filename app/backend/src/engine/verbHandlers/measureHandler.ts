import {
  Command,
  ScenarioState,
  VerbHandler,
  VerbResponse,
} from '@shared/types/scenario'

export const measureHandler: VerbHandler = {
  execute: (command: Command, scenarioState: ScenarioState): VerbResponse => {
    let responseText = 'What do you want to measure? (NO OBJECT)'

    if (scenarioState.player.distanceToPatient === 'far') {
      responseText = 'You are too far away to do that.'
      return { responseText, scenarioState }
    }

    switch (command.object) {
      case 'pulse':
        responseText = measurePulse(scenarioState)
        break
      case 'respiratoryRate':
        responseText = measureRespiratoryRate(scenarioState)
        break
      default:
        responseText = 'What do you want to measure? (NO OBJECT)'
    }
    if (command.object === 'pulse') {
      responseText = measurePulse(scenarioState)
    }

    return { responseText, scenarioState }
  },
}

const measurePulse = (scenarioState: ScenarioState) => {
  const pulse = scenarioState.patient.heartRate
  return `You take the patient's pulse at the wrist. It is ${pulse} beats per minute.`
}

const measureRespiratoryRate = (scenarioState: ScenarioState) => {
  const respiratoryRate = scenarioState.patient.respiratoryRate
  return `You take the patient's respiratory rate by holding your hand to their back. It is ${respiratoryRate} breaths per minute.`
}
