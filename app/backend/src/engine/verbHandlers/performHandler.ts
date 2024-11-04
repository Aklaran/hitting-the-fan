import {
  Command,
  PerformTarget,
  ScenarioState,
  VerbHandler,
  VerbResponse,
} from '@shared/types/scenario'
import { scenarioUtils } from '../scenarioUtils'

export const performHandler: VerbHandler = {
  execute: (command: Command, scenarioState: ScenarioState): VerbResponse => {
    let responseText = 'What would you like to perform? (NO OBJECT)'

    if (!command.object || !command.modifiers) {
      return { responseText, scenarioState }
    }

    if (scenarioState.player.distanceToPatient === 'far') {
      responseText = 'You are too far away to perform that.'
      return { responseText, scenarioState }
    }

    if (!scenarioUtils.isPerformTarget(command.object)) {
      responseText = "You don't know how to perform that."
      return { responseText, scenarioState }
    }

    return procedures[command.object](scenarioState)
  },
}

const procedures: Record<
  PerformTarget,
  (scenarioState: ScenarioState) => VerbResponse
> = {
  bloodSweep: (scenarioState) => {
    let responseText =
      "You run your hands around the outside of the patient's clothing and under them to find major bleeds."
    const majorBleeds = scenarioState.patient.ailments.filter(
      (ailment) => ailment.effects.bleed === 'major',
    )

    if (!majorBleeds || majorBleeds.length === 0) {
      responseText += ' You do not find any concerning amounts of blood.'
      return { responseText, scenarioState }
    }

    // TODO: Make a util function to create a grammatically correct comma-separated list
    const bleedLocations = majorBleeds
      .flatMap((bleed) => bleed.effects.bodyParts)
      .map((bodyPart) => bodyPart.partName)
      .join(', ')

    responseText += ` You find concerning amounts of blood on the ${bleedLocations}.`
    return { responseText, scenarioState }
  },
}
