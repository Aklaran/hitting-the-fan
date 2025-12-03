/* eslint-disable @typescript-eslint/no-unused-vars */
import { Command, ScenarioState } from '@shared/types/scenario'
import { GuardResponse } from '../pipeline/handlerPipe'
import {
  AilmentsContext,
  ApplicableContext,
  BodyPartContext,
} from '../pipeline/pipelineContexts'

const canApply = <
  T extends ApplicableContext & BodyPartContext & AilmentsContext,
>(
  _command: Command,
  _scenarioState: ScenarioState,
  context: T,
): GuardResponse => {
  const ailments = context.ailments

  const canApply = ailments.some((ailment) =>
    ailment.possibleTreatments.some(
      (treatment) => treatment.key === context.applicable,
    ),
  )

  return {
    didPass: canApply,
    failureMessage: `Now why would you want to apply a ${context.applicable} to the ${context.bodyPart.partName}?`,
  }
}

export default canApply
