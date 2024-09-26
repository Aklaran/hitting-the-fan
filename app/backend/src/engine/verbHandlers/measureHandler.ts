import { Command, ScenarioState, VerbHandler } from '@shared/types/scenario'
import { scenarioUtils } from '../scenarioUtils'

export const measureHandler: VerbHandler = {
  execute: (command: Command, scenarioState: ScenarioState): ScenarioState => {
    let responseText = 'What do you want to measure? (NO OBJECT)'

    if (scenarioState.player.distanceToPatient === 'far') {
      return scenarioUtils.appendTooFarLogEntry(scenarioState)
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

    return scenarioUtils.appendLogEntry(scenarioState, responseText, 'narrator')
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
