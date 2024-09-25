import { ScenarioState } from '@shared/types/scenario'

export const mvpScenarioState: ScenarioState = {
  log: [{ text: 'Welcome to the game!', type: 'narrator' }],
  patient: {
    name: 'Jeff',
    description: 'A man in his 30s, whimpering on the ground like a puppy.',
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
  },
}
