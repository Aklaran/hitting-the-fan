import { Command, ScenarioState } from '@shared/types/scenario'
import { OptionalVerbResponse } from '../pipeline/handlerPipe'
import { MedicalTagsContext } from '../pipeline/pipelineContexts'

const withMedicalTags = <T>(
  command: Command,
  scenarioState: ScenarioState,
  context: T,
): OptionalVerbResponse<T & MedicalTagsContext> => {
  if (!scenarioState.patient.medicalTag) {
    const responseText = 'The patient does not have medical tags.'
    return { responseText, scenarioState }
  }

  return {
    command,
    scenarioState,
    context: {
      ...context,
      medicalTags: scenarioState.patient.medicalTag,
    },
  }
}

export default withMedicalTags
