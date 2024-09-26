import {
  Command,
  ScenarioState,
  VerbHandler,
  VerbResponse,
  Wearable,
} from '@shared/types/scenario'
import { scenarioUtils } from '../scenarioUtils'

export const wearHandler: VerbHandler = {
  execute: (command: Command, scenarioState: ScenarioState): VerbResponse => {
    let responseText = 'What would you like to wear? (NO OBJECT)'

    if (!scenarioUtils.isWearable(command.object)) {
      responseText = 'Now why would you want to put that on?'
      return { responseText, scenarioState }
    }

    if (scenarioState.player.worn.includes(command.object)) {
      responseText = `You're already wearing the ${command.object}.`
      return { responseText, scenarioState }
    }

    if (!scenarioState.player.inventory.includes(command.object)) {
      responseText = `Now if only you had a ${command.object}...`
      return { responseText, scenarioState }
    }

    let newState = scenarioUtils.removeFromInventory(
      command.object,
      scenarioState,
    )

    newState = wearItem(command.object, newState)

    responseText = `You put on the ${command.object}.`

    return { responseText, scenarioState: newState }
  },
}

const wearItem = (
  item: Wearable,
  scenarioState: ScenarioState,
): ScenarioState => {
  return {
    ...scenarioState,
    player: {
      ...scenarioState.player,
      worn: [...scenarioState.player.worn, item],
    },
  }
}
