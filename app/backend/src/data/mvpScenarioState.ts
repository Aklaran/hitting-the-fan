import {
  effortSchema,
  rhythmSchema,
  ScenarioState,
} from '@shared/types/scenario'

export const mvpScenarioState: ScenarioState = {
  log: [{ text: 'Welcome to the game!', type: 'narrator' }],
  player: {
    distanceToPatient: 'far',
    inventory: ['gloves'],
    worn: [],
  },
  patient: {
    name: 'Jeff',
    descriptions: {
      near: 'A man on the ground, whimpering like a puppy and holding his leg. From close up, you can see that something is wrong with his ankle.',
      far: 'A man on the ground, whimpering like a puppy and holding his leg.',
    },
    mechanismOfInjury:
      'The patient appears to have taken a gnarly lead whip and come down hard on their ankle.',
    age: 30,
    gender: 'male',
    heartRate: 60,
    respiration: {
      rate: 20,
      rhythm: rhythmSchema.Enum.regular,
      effort: effortSchema.Enum.easy,
    },
    coreTemperatureCelsius: 37,
    bodyParts: [
      {
        part: 'leftLeg',
        description: {
          obstructed: 'The leg is covered by clothing.',
          unobstructed: 'The leg looks normal...',
        },
        obstructedState: 'obstructed',
        palpationResponse: 'You press on the left leg.',
      },
      {
        part: 'rightLeg',
        description: {
          obstructed: 'The leg is covered by clothing.',
          unobstructed: 'The leg looks normal...',
        },
        obstructedState: 'obstructed',
        palpationResponse: 'You press on the right leg.',
      },
      {
        part: 'head',
        description: {
          obstructed: 'The head is covered by a hat.',
          unobstructed: 'The leg looks normal...',
        },
        obstructedState: 'unobstructed',
        palpationResponse:
          "You remove any headwear, run your fingers through the patient's hair, and check all orifices.",
      },
      {
        part: 'spine',
        description: {
          obstructed: 'The spine is covered by clothing.',
          unobstructed: 'The spine looks normal...',
        },
        obstructedState: 'obstructed',
        palpationResponse:
          "You press on various locations on the patient's back.",
      },
      {
        part: 'back',
        description: {
          obstructed: 'The back is covered by clothing.',
          unobstructed: 'The back looks normal...',
        },
        obstructedState: 'obstructed',
        palpationResponse:
          "You press on various locations on the patient's back.",
      },
      {
        part: 'mouth',
        description: {
          obstructed: 'The patient is chewing on gum.',
          unobstructed: 'The mouth looks normal.',
        },
        obstructedState: 'obstructed',
        palpationResponse: "You probably don't want to do that.",
      },
    ],
    ailments: [
      {
        name: 'Broken ankle',
        description: 'The boy broke is ankle maaaaan',
        effects: {
          heartRateMultiplier: 1.3,
          respiratoryRateMultiplier: 1.3,
          coreTemperatureCelsiusMultiplier: 1.3,
          bodyParts: [
            {
              part: 'leftLeg',
              description: {
                obstructed: 'It looks like the foot is turned the wrong way...',
                unobstructed:
                  'The ankle is swollen and the foot is turned the wrong way.',
              },
              palpationResponse:
                "Pressing on the outside of the patient's ankle causes severe pain.",
            },
          ],
        },
      },
    ],
    instructions: {
      dontMove: false,
      acceptCare: false,
    },
    isSpineControlled: false,
  },
  environment: {
    description: "You're at the base of a mega alpine climb.",
    temperatureCelsius: 0,
    hazards: ['The cliff above is a total chossfest.'],
  },
}
