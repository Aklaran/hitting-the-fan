import { Command, ScenarioState } from '@shared/types/scenario'
import { OptionalActionResponse } from '../pipeline/handlerPipe'
import { AilmentContext, AskableContext } from '../pipeline/pipelineContexts'

const withChiefComplaint = <T extends AskableContext>(
  command: Command,
  scenarioState: ScenarioState,
  context: T,
): OptionalActionResponse<T & AilmentContext> => {
  const chiefComplaints = scenarioState.patient.ailments.filter(
    (ailment) => ailment.isChiefComplaint,
  )

  if (chiefComplaints.length != 1) {
    return {
      responseText: 'DATA ERROR: too many chief complaints',
      scenarioState,
      result: 'unexpected_error',
    }
  }

  const chiefComplaint = chiefComplaints[0]

  return {
    command,
    scenarioState,
    context: {
      ...context,
      ailment: chiefComplaint,
    },
  }
}

export default withChiefComplaint
