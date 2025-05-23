/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command, Distance, ScenarioState } from '@shared/types/scenario'
import { GuardResponse } from '../pipeline/handlerPipe'

const isDistanceFromPatient = <T>(distance: Distance) => {
  return (
    _command: Command,
    scenarioState: ScenarioState,
    _context: T,
  ): GuardResponse => {
    return {
      didPass: scenarioState.player.distanceToPatient == distance,
      failureMessage: `You are too ${scenarioState.player.distanceToPatient} to do that.`,
    }
  }
}

export default isDistanceFromPatient
