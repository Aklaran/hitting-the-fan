import {
  Command,
  QuestionTarget,
  ScenarioState,
  VerbHandler,
  VerbResponse,
} from '@shared/types/scenario'
import { LORCapabilities } from '../../scenarioUtils'
import withAskable from '../enrichers/withAskable'
import withBodyPart from '../enrichers/withBodyPart'
import withInjuries from '../enrichers/withInjuries'
import withMedicalTags from '../enrichers/withMedicalTags'
import hasCommandObject from '../guards/hasCommandObject'
import hasLevelOfResponsiveness from '../guards/hasLevelOfResponsiveness'
import hasMedicalTags from '../guards/hasMedicalTags'
import isDistanceFromPatient from '../guards/isDistanceFromPatient'
import {
  enrich,
  guard,
  Handler,
  pipeHandlers,
  transform,
} from '../pipeline/handlerPipe'
import {
  AskableContext,
  BodyPartContext,
  InjuryContext,
  MedicalTagsContext,
  PipelineContext,
} from '../pipeline/pipelineContexts'

export const askHandler: VerbHandler = {
  execute: (command: Command, scenarioState: ScenarioState): VerbResponse => {
    return pipeHandlers(
      guard<PipelineContext>(hasCommandObject),
      guard(isDistanceFromPatient('near')),
      enrich<PipelineContext, AskableContext>(withAskable),
      transform<AskableContext>((command, scenarioState, context) =>
        responseBank[context.askable](command, scenarioState, context),
      ),
    )(command, scenarioState, {})
  },
}

const responseBank: Record<
  QuestionTarget,
  Handler<AskableContext, AskableContext>
> = {
  name: (command, scenarioState, context) =>
    pipeHandlers(
      guard(hasLevelOfResponsiveness(LORCapabilities.knowsIdentity)),
      transform(() => {
        const responseText = `The patient responds, "My name ${scenarioState.patient.name}!"`
        return { responseText, scenarioState }
      }),
    )(command, scenarioState, context),

  age: (command, scenarioState, context) =>
    pipeHandlers(
      guard(hasLevelOfResponsiveness(LORCapabilities.knowsIdentity)),
      transform(() => {
        const responseText = `The patient responds, "I am ${scenarioState.patient.age} years old."`
        return { responseText, scenarioState }
      }),
    )(command, scenarioState, context),

  gender: (command, scenarioState, context) =>
    pipeHandlers(
      guard(hasLevelOfResponsiveness(LORCapabilities.knowsIdentity)),
      transform(() => {
        const responseText = `The patient responds, "I am ${scenarioState.patient.gender}."`
        return { responseText, scenarioState }
      }),
    )(command, scenarioState, context),

  injury: (command, scenarioState, context) =>
    pipeHandlers(
      enrich<AskableContext, BodyPartContext>(withBodyPart),
      enrich<BodyPartContext, InjuryContext>(withInjuries),
      transform((_command, scenarioState, context) => {
        if (context.injuries.length > 0) {
          const responseText = `The patient responds, "Yeah, I think I hurt my ${context.bodyPart.partName}."`
          return { responseText, scenarioState }
        }

        const responseText = `The patient responds, "No, I don't think I hurt my ${context.bodyPart.partName}."`
        return { responseText, scenarioState }
      }),
    )(command, scenarioState, context),

  medicalTags: (command, scenarioState, context) =>
    pipeHandlers(
      guard<AskableContext>(
        hasLevelOfResponsiveness(LORCapabilities.knowsIdentity),
      ),
      guard(
        hasMedicalTags,
        `The patient responds, "I don't have medical tags."`,
      ),
      enrich<AskableContext, MedicalTagsContext>(withMedicalTags),
      transform((_, scenarioState, context) => {
        let responseText = `The patient responds, "Yes, I have medical tags." They remove them and hand them to you. `
        responseText += `The tags read: ${context.medicalTags.description}`

        return { responseText, scenarioState }
      }),
    )(command, scenarioState, context),

  whatHappened: (command, scenarioState, context) =>
    pipeHandlers(
      guard(hasLevelOfResponsiveness(LORCapabilities.knowsEvents)),
      transform(() => {
        const responseText = `The patient responds, "${scenarioState.patient.events}"`
        return { responseText, scenarioState }
      }),
    )(command, scenarioState, context),

  time: (command, scenarioState, context) =>
    pipeHandlers(
      guard(hasLevelOfResponsiveness(LORCapabilities.knowsTime)),
      transform(() => {
        const responseText = `The patient responds, "It's ${scenarioState.environment.time.toString()}."`
        return { responseText, scenarioState }
      }),
    )(command, scenarioState, context),

  place: (command, scenarioState, context) =>
    pipeHandlers(
      guard(hasLevelOfResponsiveness(LORCapabilities.knowsLocation)),
      transform(() => {
        const responseText = `The patient responds, "${scenarioState.environment.place}."`
        return { responseText, scenarioState }
      }),
    )(command, scenarioState, context),

  allergies: (command, scenarioState, context) =>
    pipeHandlers(
      guard(hasLevelOfResponsiveness(LORCapabilities.knowsIdentity)),
      transform(() => {
        const responseText = `The patient responds, "My allergies are: ${scenarioState.patient.allergies}."`
        return { responseText, scenarioState }
      }),
    )(command, scenarioState, context),

  medications: (command, scenarioState, context) =>
    pipeHandlers(
      guard(hasLevelOfResponsiveness(LORCapabilities.knowsIdentity)),
      transform(() => {
        const responseText = `The patient responds, "I am taking ${scenarioState.patient.medications}."`
        return { responseText, scenarioState }
      }),
    )(command, scenarioState, context),
}
