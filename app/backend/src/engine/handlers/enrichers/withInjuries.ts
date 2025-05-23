import { scenarioUtils } from '@backend/engine/scenarioUtils'
import { Command, ScenarioState } from '@shared/types/scenario'
import { OptionalVerbResponse } from '../pipeline/handlerPipe'
import { BodyPartContext, InjuryContext } from '../pipeline/pipelineContexts'

const withInjuries = <T extends BodyPartContext>(
  command: Command,
  scenarioState: ScenarioState,
  context: T,
): OptionalVerbResponse<T & InjuryContext> => {
  const injuries = scenarioUtils.getAilmentsByBodyPart(
    scenarioState.patient.ailments,
    context.bodyPart,
  )
  return {
    command,
    scenarioState,
    context: {
      ...context,
      injuries,
    },
  }
}

export default withInjuries
