/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command, ScenarioState } from '@shared/types/scenario'
import { GuardResponse } from '../pipeline/handlerPipe'
import {
  AilmentsContext,
  ApplicableContext,
} from '../pipeline/pipelineContexts'

const hasNotBeenTreated = <T extends ApplicableContext & AilmentsContext>(
  _command: Command,
  _scenarioState: ScenarioState,
  context: T,
): GuardResponse => {
  const ailments = context.ailments

  const hasBeenTreated = ailments.some((ailment) =>
    ailment.appliedTreatments.includes(context.applicable),
  )

  return {
    didPass: !hasBeenTreated,
    failureMessage: `You have already applied ${context.applicable} to this body part.`,
  }
}

export default hasNotBeenTreated
