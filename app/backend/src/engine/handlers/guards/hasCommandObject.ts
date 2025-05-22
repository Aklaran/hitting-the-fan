/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command, ScenarioState } from '@shared/types/scenario'
import { GuardResponse } from '../pipeline/handlerPipe'

const hasCommandObject = <T>(
  command: Command,
  _scenarioState: ScenarioState,
  _context: T,
): GuardResponse => {
  return {
    didPass: !!command.object,
    failureMessage: 'Command object does not exist.',
  }
}

export default hasCommandObject
