import {
  CreateScenarioSchema,
  effortSchema,
  rhythmSchema,
} from '@shared/types/scenario'

const mvpScenario: CreateScenarioSchema = {
  key: 'mvp-scenario',
  title: 'MVP Scenario',
  openingPrompt:
    'You are a medic student on your first day of clinical rotations. You are assigned to a patient with a broken ankle. You need to diagnose the patient and treat the injury. You are in a hospital room with a patient who has a broken ankle.',
  initialState: {
    log: [{ text: 'Welcome to the game!', type: 'narrator' }],
    player: {
      distanceToPatient: 'far',
      inventory: ['gloves', 'thermometer'],
      worn: [],
      notes: '',
    },
    patient: {
      name: 'Jeff',
      descriptions: {
        near: 'A man on the ground, whimpering like a puppy and holding his leg. From close up, you can see that something is wrong with his ankle.',
        far: 'A man on the ground, whimpering like a puppy and holding his leg.',
      },
      age: 30,
      gender: 'male',
      temperatureFahrenheit: 98.6,
      circulation: {
        rate: 60,
        rhythm: 'regular',
      },
      respiration: {
        rate: 20,
        rhythm: rhythmSchema.Enum.regular,
        effort: effortSchema.Enum.easy,
      },
      skin: {
        color: 'pink',
        temperature: 'warm',
        moisture: 'moist',
      },
      pupils: {
        equality: 'equal',
        shape: 'round',
        reactivity: 'reactive',
      },
      coreTemperatureCelsius: 37,
      bodyParts: [
        // TODO: bake "normal" bodyparts into the model, only modify with ailments?
        {
          partName: 'leftLeg',
          motion: 'normal',
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
          motion: 'normal',
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
          motion: 'normal',
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
          motion: 'normal',
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
          motion: 'normal',
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
          motion: 'normal',
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
          motion: 'normal',
          description: {
            obstructed: 'The patient is chewing on gum.',
            unobstructed: 'The mouth looks normal.',
          },
          obstructedState: 'obstructed',
          palpationResponse: "You probably don't want to do that.",
        },
        {
          partName: 'chest',
          motion: 'normal',
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
          motion: 'normal',
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
          motion: 'normal',
          description: {
            obstructed: 'The hips are covered by clothing.',
            unobstructed: 'The hips looks normal...',
          },
          obstructedState: 'obstructed',
          palpationResponse:
            "You press and roll on all 4 quadrants of the patient's abdomen, asking if they feel any pain.",
        },
        {
          partName: 'leftArm',
          motion: 'normal',
          description: {
            obstructed: 'The left arm is covered by clothing.',
            unobstructed: 'The left arm looks normal...',
          },
          obstructedState: 'obstructed',
          palpationResponse:
            "You circle your hands around the patient's left arm and press down to their hands, asking if they feel any pain.",
        },
        {
          partName: 'rightArm',
          motion: 'normal',
          description: {
            obstructed: 'The right arm is covered by clothing.',
            unobstructed: 'The right arm looks normal...',
          },
          obstructedState: 'obstructed',
          palpationResponse:
            "You circle your hands around the patient's right arm and press down to their hands, asking if they feel any pain.",
        },
      ],
      ailments: [
        {
          name: 'Broken ankle',
          description: 'The boy broke is ankle maaaaan',
          isChiefComplaint: true,
          mechanismOfInjury: 'I was climbing a wall and fell down.',
          provokers: 'It hurts when I move it.',
          palliatives: "It hurts less when I don't move it.",
          quality: 'Sharp!',
          region: 'My ankle.',
          radiation: 'Nope, just my ankle.',
          referral: 'Nope, just my ankle.',
          severity: '8/10 pretty bad man.',
          onsetTime: 'Just now, you saw it happen!',
          intensityTrend:
            "It's starting to hurt more now that you're pestering me about it.",
          normality:
            "No man, my ankle isn't usually broken, believe it or not.",
          happenedBefore: "Yeah I've broken this ankle before.",
          effects: {
            circulation: {
              heartRateModifier: 1.3,
              rateModifierType: 'multiplicative',
              rhythm: 'irregular',
            },
            respiration: {
              respiratoryRateModifier: 1.3,
              rateModifierType: 'multiplicative',
              rhythm: 'irregular',
              effort: 'labored',
            },
            pupils: {
              equality: 'equal',
              reactivity: 'reactive',
              shape: 'round',
            },
            skin: {
              color: 'pink',
              moisture: 'dry',
              temperature: 'cool',
            },
            temperature: {
              temperatureModifier: 1.01,
              rateModifierType: 'multiplicative',
            },
            bleed: 'none',
            bodyParts: [
              {
                partName: 'leftFoot',
                description: {
                  obstructed:
                    'It looks like the foot is turned the wrong way...',
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
                obstructedState: 'obstructed',
              },
            ],
          },
          possibleTreatments: [
            {
              key: 'splint',
              effects: {
                circulation: {
                  heartRateModifier: -0.2,
                  rateModifierType: 'additive',
                  rhythm: 'regular',
                },
                respiration: {
                  respiratoryRateModifier: -0.2,
                  rateModifierType: 'additive',
                  rhythm: 'regular',
                  effort: 'easy',
                },
                skin: {
                  color: 'pink',
                  moisture: 'dry',
                  temperature: 'cool',
                },
                pupils: {
                  equality: 'equal',
                  reactivity: 'reactive',
                  shape: 'round',
                },
                temperature: {
                  temperatureModifier: -0.2,
                  rateModifierType: 'additive',
                },
                bleed: 'none',
                bodyParts: [
                  {
                    partName: 'leftFoot',
                    description: {
                      obstructed: 'The foot is covered by a splint.',
                      unobstructed: 'The foot is covered by a splint.',
                    },
                    palpationResponse: 'You press on the left foot.',
                    circulation: { quality: 'strong' },
                    sensation: 'normal',
                    motion: 'normal',
                    obstructedState: 'obstructed',
                  },
                ],
              },
            },
          ],
          appliedTreatments: [],
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
      allergies: ['dogs', 'cats'],
      medications: ['zyrtec'],
      hasDiabetes: false,
      hasAsthma: false,
      hasSeizures: false,
      hasHeartConditions: false,
      lastIntakeOutput: 'I pooped this morning!',
    },
    environment: {
      description: "You're at the base of a mega alpine climb.",
      temperatureCelsius: 0,
      hazards: ['The cliff above is a total chossfest.'],
      time: 'early in the afternoon on May 20th',
      place: 'the base of a mega alpine climb.',
    },
    possibleGlobalTreatments: [
      {
        key: 'splint',
        effects: {
          circulation: {
            heartRateModifier: -0.2,
            rateModifierType: 'additive',
            rhythm: 'regular',
          },
          respiration: {
            respiratoryRateModifier: -0.2,
            rateModifierType: 'additive',
            rhythm: 'irregular',
            effort: 'easy',
          },
          skin: {
            color: 'pink',
            moisture: 'dry',
            temperature: 'cool',
          },
          pupils: {
            equality: 'equal',
            reactivity: 'reactive',
            shape: 'round',
          },
          temperature: {
            temperatureModifier: -0.2,
            rateModifierType: 'additive',
          },
          bleed: 'none',
        },
      },
    ],
    globalTreatmentsApplied: [],
  },
}

export const scenarios = [mvpScenario]
