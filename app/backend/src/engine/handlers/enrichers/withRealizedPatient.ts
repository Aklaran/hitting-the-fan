import { scenarioUtils } from '@backend/engine/scenarioUtils'
import { Command, ScenarioState } from '@shared/types/scenario'
import { OptionalActionResponse } from '../pipeline/handlerPipe'
import { RealizedPatientContext } from '../pipeline/pipelineContexts'

export const withRealizedPatient = <T>(
  command: Command,
  scenarioState: ScenarioState,
  context: T,
): OptionalActionResponse<T & RealizedPatientContext> => {
  return {
    command,
    scenarioState,
    context: {
      ...context,
      realizedPatient: scenarioUtils.calculateRealizedPatient(scenarioState),
    },
  }
}
