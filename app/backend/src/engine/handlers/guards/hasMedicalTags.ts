/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command, ScenarioState } from '@shared/types/scenario'
import { GuardResponse } from '../pipeline/handlerPipe'

const hasMedicalTags = <T>(
  _command: Command,
  scenarioState: ScenarioState,
  _context: T,
): GuardResponse => {
  return {
    didPass: !!scenarioState.patient.medicalTag,
    failureMessage: 'The patient does not have medical tags.',
  }
}

export default hasMedicalTags
