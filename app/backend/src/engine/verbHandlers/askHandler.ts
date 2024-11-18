import {
  Command,
  QuestionTarget,
  ScenarioState,
  VerbHandler,
  VerbResponse,
} from '@shared/types/scenario'
import { LORCapabilities, scenarioUtils } from '../scenarioUtils'

export const askHandler: VerbHandler = {
  execute: (command: Command, scenarioState: ScenarioState): VerbResponse => {
    let responseText = 'What would you like to ask? (NO OBJECT)'

    if (!command.object) {
      return { responseText, scenarioState }
    }

    if (!scenarioUtils.isQuestionTarget(command.object)) {
      responseText = `You probably don't want to ask your patient about that...`
      return { responseText, scenarioState }
    }

    return scenarioUtils.withDistanceCheck(
      scenarioUtils.withConsciousnessCheck(responseBank[command.object]),
    )(command, scenarioState)
  },
}

const askAboutInjury = (
  command: Command,
  scenarioState: ScenarioState,
): VerbResponse => {
  let responseText = 'Please provide a body part to ask about.'
  if (
    !command.modifiers ||
    !scenarioUtils.isBodyPartName(command.modifiers[0])
  ) {
    return { responseText, scenarioState }
  }

  const bodyPartName = command.modifiers[0]

  const bodyPart = scenarioUtils.getBodyPartByName(
    scenarioState.patient.bodyParts,
    bodyPartName,
  )

  if (!bodyPart) {
    responseText = `The patient doesn't have a ${bodyPartName}. Weird.`
    return { responseText, scenarioState }
  }

  const injuries = scenarioUtils.getAilmentsByBodyPart(
    scenarioState.patient.ailments,
    bodyPart,
  )

  if (injuries.length > 0) {
    responseText = `The patient responds, "Yeah, I think I hurt my ${bodyPart.partName}."`
    return { responseText, scenarioState }
  }

  responseText = `The patient responds, "No, I don't think I hurt my ${bodyPart.partName}."`
  return { responseText, scenarioState }
}

const askAboutMedicalTags = (_: Command, scenarioState: ScenarioState) => {
  const levelOfResponsiveness = scenarioState.patient.levelOfResponsiveness

  if (!LORCapabilities.knowsIdentity(levelOfResponsiveness)) {
    const responseText = `The patient responds, "I... I don't know..."`
    return { responseText, scenarioState }
  }

  let responseText = `The patient responds, "I don't have medical tags."`

  if (!scenarioState.patient.medicalTag) {
    return { responseText, scenarioState }
  }

  responseText = `The patient responds, "Yes, I have medical tags." They remove them and hand them to you. `
  responseText += `The tags read: ${scenarioState.patient.medicalTag.description}`

  return { responseText, scenarioState }
}

const responseBank: Record<
  QuestionTarget,
  (command: Command, scenarioState: ScenarioState) => VerbResponse
> = {
  name: (_, scenarioState) => {
    const levelOfResponsiveness = scenarioState.patient.levelOfResponsiveness

    if (!LORCapabilities.knowsIdentity(levelOfResponsiveness)) {
      const responseText = `The patient responds, "I... I don't know..."`
      return { responseText, scenarioState }
    }

    const responseText = `The patient responds, "My name ${scenarioState.patient.name}!"`
    return { responseText, scenarioState }
  },

  age: (_, scenarioState) => {
    const levelOfResponsiveness = scenarioState.patient.levelOfResponsiveness

    if (!LORCapabilities.knowsIdentity(levelOfResponsiveness)) {
      const responseText = `The patient responds, "I... I don't know..."`
      return { responseText, scenarioState }
    }

    const responseText = `The patient responds, "I am ${scenarioState.patient.age} years old."`
    return { responseText, scenarioState }
  },

  gender: (_, scenarioState) => {
    const levelOfResponsiveness = scenarioState.patient.levelOfResponsiveness

    if (!LORCapabilities.knowsIdentity(levelOfResponsiveness)) {
      const responseText = `The patient responds, "I... I don't know..."`
      return { responseText, scenarioState }
    }

    const responseText = `The patient responds, "I am ${scenarioState.patient.gender}."`
    return { responseText, scenarioState }
  },

  injury: (command, scenarioState) => askAboutInjury(command, scenarioState),

  medicalTags: (command, scenarioState) =>
    askAboutMedicalTags(command, scenarioState),

  whatHappened: (_, scenarioState) => {
    const levelOfResponsiveness = scenarioState.patient.levelOfResponsiveness

    if (!LORCapabilities.knowsEvents(levelOfResponsiveness)) {
      const responseText = `The patient responds, "I... I don't know..."`
      return { responseText, scenarioState }
    }

    const responseText = `The patient responds, "${scenarioState.patient.events}"`
    return { responseText, scenarioState }
  },

  time: (_, scenarioState) => {
    const levelOfResponsiveness = scenarioState.patient.levelOfResponsiveness

    if (!LORCapabilities.knowsTime(levelOfResponsiveness)) {
      const responseText = `The patient responds, "I... I don't know..."`
      return { responseText, scenarioState }
    }

    const responseText = `The patient responds, "It's ${scenarioState.environment.time.toString()}."`
    return { responseText, scenarioState }
  },

  place: (_, scenarioState) => {
    const levelOfResponsiveness = scenarioState.patient.levelOfResponsiveness

    if (!LORCapabilities.knowsLocation(levelOfResponsiveness)) {
      const responseText = `The patient responds, "I... I don't know..."`
      return { responseText, scenarioState }
    }

    const responseText = `The patient responds, "${scenarioState.environment.place}."`
    return { responseText, scenarioState }
  },
}
