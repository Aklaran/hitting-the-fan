/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command, ScenarioState } from '@shared/types/scenario'

const hasCommandObject = <T>(
  command: Command,
  _scenarioState: ScenarioState,
  _context: T,
): boolean => {
  return !!command.object
}

export default hasCommandObject
