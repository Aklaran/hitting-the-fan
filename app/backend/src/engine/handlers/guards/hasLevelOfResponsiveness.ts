/* eslint-disable @typescript-eslint/no-unused-vars */
import { LORCapabilities } from '@backend/engine/scenarioUtils'
import {
  Command,
  LevelOfResponsiveness,
  ScenarioState,
} from '@shared/types/scenario'
import { GuardResponse } from '../pipeline/handlerPipe'

const hasLevelOfResponsiveness = <T>(
  check: (lor: LevelOfResponsiveness) => boolean,
) => {
  return (
    _command: Command,
    scenarioState: ScenarioState,
    _context: T,
  ): GuardResponse => {
    const lor = scenarioState.patient.levelOfResponsiveness

    if (!LORCapabilities.isAwake(lor)) {
      return {
        didPass: false,
        failureMessage: `Homie is knocked tf out.`,
      }
    }
    return {
      didPass: check(lor),
      failureMessage: `The patient responds, "I... I don't know..."`,
    }
  }
}

export default hasLevelOfResponsiveness
