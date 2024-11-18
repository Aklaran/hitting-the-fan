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
    circulation: {
      rate: 60,
      rhythm: 'regular',
    },
    respiration: {
      rate: 20,
      rhythm: rhythmSchema.Enum.regular,
      effort: effortSchema.Enum.easy,
    },
    coreTemperatureCelsius: 37,
    bodyParts: [
      {
        partName: 'leftLeg',
        description: {
          obstructed: 'The leg is covered by clothing.',
          unobstructed: 'The skin of the leg is exposed.',
        },
        obstructedState: 'obstructed',
        palpationResponse:
          'You circle your hands around the left leg and press all the way down to the foot.',
      },
      {
        partName: 'rightLeg',
        description: {
          obstructed: 'The leg is covered by clothing.',
          unobstructed: 'The skin of the leg is exposed',
        },
        obstructedState: 'obstructed',
        palpationResponse:
          'You circle your hands around the right leg and press all the way down to the foot.',
      },
      {
        partName: 'rightFoot',
        description: {
          obstructed: 'The foot is covered by a shoe.',
          unobstructed: 'The foot is exposed.',
        },
        obstructedState: 'obstructed',
        palpationResponse: 'You press on the right foot.',
        circulation: {
          quality: 'strong',
        },
        sensation: 'normal',
        motion: 'normal',
      },
      {
        partName: 'leftFoot',
        description: {
          obstructed: 'The foot is covered by a shoe.',
          unobstructed: 'The foot is exposed.',
        },
        obstructedState: 'obstructed',
        palpationResponse: 'You press on the left foot.',
        circulation: {
          quality: 'strong',
        },
        sensation: 'normal',
        motion: 'normal',
      },
      {
        partName: 'rightHand',
        description: {
          obstructed: 'The hand is covered by a glove.',
          unobstructed: 'The hand is exposed.',
        },
        obstructedState: 'obstructed',
        palpationResponse: 'You press on the right hand.',
        circulation: {
          quality: 'strong',
        },
        sensation: 'normal',
        motion: 'normal',
      },
      {
        partName: 'leftHand',
        description: {
          obstructed: 'The hand is covered by a glove.',
          unobstructed: 'The hand is exposed.',
        },
        obstructedState: 'unobstructed',
        palpationResponse: 'You press on the left hand.',
        circulation: {
          quality: 'strong',
        },
        sensation: 'normal',
        motion: 'normal',
      },
      {
        partName: 'head',
        description: {
          obstructed: 'The head is covered by a hat.',
          unobstructed: 'The head is uncovered.',
        },
        obstructedState: 'unobstructed',
        palpationResponse:
          "You remove any headwear, run your fingers through the patient's hair, and check all orifices.",
      },
      {
        partName: 'neck',
        description: {
          obstructed: 'The neck is covered by a buff.',
          unobstructed: 'The neck is uncovered.',
        },
        obstructedState: 'unobstructed',
        palpationResponse:
          "You check for tracheal alignment and press lightly on the patient's collarbones.",
        circulation: { quality: 'strong' },
      },
      {
        partName: 'spine',
        description: {
          obstructed: 'The spine is covered by clothing.',
          unobstructed: 'The spine looks normal...',
        },
        obstructedState: 'obstructed',
        palpationResponse:
          "You press on various locations on the patient's back.",
      },
      {
        partName: 'back',
        description: {
          obstructed: 'The back is covered by clothing.',
          unobstructed: 'The back looks normal...',
        },
        obstructedState: 'obstructed',
        palpationResponse:
          "You press on various locations on the patient's back.",
      },
      {
        partName: 'mouth',
        description: {
          obstructed: 'The patient is chewing on gum.',
          unobstructed: 'The mouth looks normal.',
        },
        obstructedState: 'obstructed',
        palpationResponse: "You probably don't want to do that.",
      },
      {
        partName: 'chest',
        description: {
          obstructed: 'The chest is covered by clothing.',
          unobstructed: 'The chest looks normal...',
        },
        obstructedState: 'obstructed',
        palpationResponse:
          "You push in on either side of the patient's chest wall high and low and ask the patient to inhale, feeling for instability or asymmetry.",
      },
      {
        partName: 'stomach',
        description: {
          obstructed: 'The stomach is covered by clothing.',
          unobstructed: 'The stomach looks normal...',
        },
        obstructedState: 'obstructed',
        palpationResponse:
          "You press and roll on all 4 quadrants of the patient's abdomen, asking if they feel any pain.",
      },
      {
        partName: 'hips',
        description: {
          obstructed: 'The hips is covered by clothing.',
          unobstructed: 'The hips looks normal...',
        },
        obstructedState: 'obstructed',
        palpationResponse:
          "You press and roll on all 4 quadrants of the patient's abdomen, asking if they feel any pain.",
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
          bleed: 'none',
          bodyParts: [
            {
              partName: 'leftFoot',
              description: {
                obstructed: 'It looks like the foot is turned the wrong way...',
                unobstructed:
                  'The ankle is swollen and the foot is turned the wrong way.',
              },
              palpationResponse:
                "Pressing on the outside of the patient's ankle causes severe pain.",
              circulation: {
                quality: 'bounding',
              },
              sensation: 'tingling',
              motion: 'immobile',
            },
          ],
        },
      },
    ],
    instructions: {
      dontMove: false,
      acceptCare: false,
      breathe: false,
    },
    isSpineControlled: false,
    medicalTag: {
      description: 'Yo yo, this is mah medical tag.',
    },
    events:
      'We were just climbing this pitch and I took a hard fall and came down on my ankle weird. I think it might be broken.',
    levelOfResponsiveness: 'AO4',
    position: 'supine',
  },
  environment: {
    description: "You're at the base of a mega alpine climb.",
    temperatureCelsius: 0,
    hazards: ['The cliff above is a total chossfest.'],
  },
}
