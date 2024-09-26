import { ScenarioState } from '@shared/types/scenario'

export const mvpScenarioState: ScenarioState = {
  log: [{ text: 'Welcome to the game!', type: 'narrator' }],
  player: {
    distanceToPatient: 'far',
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
    respiratoryRate: 20,
    coreTemperatureCelsius: 37,
    bodyParts: [
      {
        part: 'leftLeg',
        description: 'The leg looks normal...',
        palpationResponse: 'You press on the left leg.',
      },
      {
        part: 'rightLeg',
        description: 'The leg looks normal...',
        palpationResponse: 'You press on the right leg.',
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
              description:
                'The ankle is swollen and the foot turned the wrong way.',
              palpationResponse:
                "Pressing on the outside of the patient's ankle causes severe pain.",
            },
          ],
        },
      },
    ],
  },
  environment: {
    description: "You're at the base of a mega alpine climb.",
    temperatureCelsius: 0,
    hazards: ['The cliff above is a total chossfest.'],
  },
}
