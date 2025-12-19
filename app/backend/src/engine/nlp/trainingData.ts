/**
 * Training Data for NLP.js Intent Classification
 *
 * Each intent has 5-10 example phrases covering:
 * - Imperative commands ("check the pulse")
 * - Questions ("what is their heart rate")
 * - Casual phrasing ("can you take their pulse")
 * - Medical terminology ("palpate radial pulse")
 * - Lay terms ("feel for a heartbeat")
 */

export interface TrainingDocument {
  intent: string
  utterances: string[]
}

/**
 * Measurement intents
 */
export const measureIntents: TrainingDocument[] = [
  {
    intent: 'measure.pulse',
    utterances: [
      'check the pulse',
      'take their pulse',
      'what is their heart rate',
      'feel for a pulse',
      'measure the pulse',
      'check their heartbeat',
      'is there a pulse',
      'do they have a pulse',
      'palpate radial pulse',
      'check bpm',
    ],
  },
  {
    intent: 'measure.respiration',
    utterances: [
      'check their breathing',
      'count respirations',
      'what is their respiratory rate',
      'how fast are they breathing',
      'measure breathing',
      'check respiration',
      'are they breathing normally',
      'count their breaths',
      'assess their breathing',
      'check respiratory rate',
    ],
  },
  {
    intent: 'measure.pupils',
    utterances: [
      'check their pupils',
      'look at their eyes',
      'assess pupil response',
      'check pupillary response',
      'are their pupils reactive',
      'check the eyes',
      'examine pupils',
      'pupil check',
      'assess their eyes',
    ],
  },
  {
    intent: 'measure.sensation',
    utterances: [
      'check sensation',
      'can you feel this',
      'test for feeling',
      'check for numbness',
      'assess sensation',
      'do you have feeling',
      'any numbness or tingling',
      'check sensory function',
    ],
  },
  {
    intent: 'measure.motion',
    utterances: [
      'check motion',
      'can you move',
      'test movement',
      'assess motor function',
      'check for movement',
      'can they move',
      'test motor function',
    ],
  },
  {
    intent: 'measure.skinTemperature',
    utterances: [
      'check skin temperature',
      'feel their skin',
      'is their skin warm or cold',
      'assess skin temp',
      'how warm is their skin',
      'check if skin is warm',
    ],
  },
  {
    intent: 'measure.skinColor',
    utterances: [
      'check skin color',
      'what color is their skin',
      'assess skin colour',
      'are they pale',
      'check for cyanosis',
      'look at their skin color',
    ],
  },
  {
    intent: 'measure.skinMoisture',
    utterances: [
      'check skin moisture',
      'is their skin dry or sweaty',
      'assess diaphoresis',
      'are they sweating',
      'is the skin clammy',
      'check if they are sweating',
    ],
  },
  {
    intent: 'measure.temperature',
    utterances: [
      'take their temperature',
      'check their temp',
      'do they have a fever',
      'measure body temperature',
      'what is their temperature',
      'check for fever',
    ],
  },
]

/**
 * Look/examine intents
 */
export const lookIntents: TrainingDocument[] = [
  {
    intent: 'look.patient',
    utterances: [
      'look at the patient',
      'examine the patient',
      'what does the patient look like',
      'observe the patient',
      'assess the patient',
      'check on the patient',
      'look at them',
      'see how they look',
      'visual assessment of patient',
    ],
  },
  {
    intent: 'look.environment',
    utterances: [
      'look at the environment',
      'check the surroundings',
      'what does the environment look like',
      'observe the area',
      'assess the scene',
      'look around',
      'survey the environment',
      'check the scene',
      'examine the surroundings',
    ],
  },
  {
    intent: 'look.bodypart',
    utterances: [
      'look at their arm',
      'examine the leg',
      'check their head',
      'look at the chest',
      'examine their back',
      'look at the injured area',
      'check their hand',
      'examine their foot',
      'look at that body part',
      'examine their left arm',
      'look at their right leg',
    ],
  },
]

/**
 * Ask/question intents - SAMPLE
 */
export const askSampleIntents: TrainingDocument[] = [
  {
    intent: 'ask.name',
    utterances: [
      'what is your name',
      'who are you',
      'can you tell me your name',
      'what should I call you',
      'your name please',
      "what's your name",
      'tell me your name',
    ],
  },
  {
    intent: 'ask.age',
    utterances: [
      'how old are you',
      'what is your age',
      'can you tell me your age',
      'your age',
      'how many years old are you',
    ],
  },
  {
    intent: 'ask.allergies',
    utterances: [
      'do you have any allergies',
      'are you allergic to anything',
      'what are your allergies',
      'any allergies',
      'allergic to any medications',
      'do you have allergies',
      'tell me about your allergies',
    ],
  },
  {
    intent: 'ask.medications',
    utterances: [
      'what medications are you taking',
      'are you on any medications',
      'do you take any medicine',
      'what drugs are you on',
      'any prescriptions',
      'tell me about your medications',
      'current medications',
    ],
  },
  {
    intent: 'ask.lastIntakeOutput',
    utterances: [
      'when did you last eat',
      'when did you last drink',
      'when was your last meal',
      'have you eaten today',
      'when did you last use the bathroom',
      'last intake and output',
      'when did you last eat or drink',
    ],
  },
  {
    intent: 'ask.medicalTags',
    utterances: [
      'do you have medical tags',
      'are you wearing a medical bracelet',
      'do you have a medic alert',
      'any medical identification',
      'do you have medical id',
      'wearing any medical jewelry',
    ],
  },
  {
    intent: 'ask.diabetes',
    utterances: [
      'do you have diabetes',
      'are you diabetic',
      'do you take insulin',
      'any blood sugar issues',
      'history of diabetes',
    ],
  },
  {
    intent: 'ask.asthma',
    utterances: [
      'do you have asthma',
      'do you use an inhaler',
      'any breathing problems',
      'history of asthma',
      'respiratory conditions',
    ],
  },
  {
    intent: 'ask.seizures',
    utterances: [
      'do you have seizures',
      'history of epilepsy',
      'have you had seizures before',
      'any seizure disorders',
      'do you have epilepsy',
    ],
  },
  {
    intent: 'ask.heartConditions',
    utterances: [
      'do you have heart problems',
      'any heart conditions',
      'history of heart disease',
      'cardiac history',
      'have you had a heart attack',
      'any heart issues',
    ],
  },
  {
    intent: 'ask.whatHappened',
    utterances: [
      'what happened',
      'tell me what happened',
      'how did this happen',
      'can you tell me what happened',
      'describe what happened',
      'what occurred',
    ],
  },
  {
    intent: 'ask.mechanismOfInjury',
    utterances: [
      'how were you injured',
      'what caused the injury',
      'mechanism of injury',
      'how did you get hurt',
      'what happened to cause this',
    ],
  },
]

/**
 * Ask/question intents - OPQRST
 */
export const askOpqrstIntents: TrainingDocument[] = [
  {
    intent: 'ask.onset',
    utterances: [
      'when did this start',
      'when did it begin',
      'how long has this been going on',
      'when did you first notice this',
      'onset of symptoms',
      'when did the pain start',
    ],
  },
  {
    intent: 'ask.provokers',
    utterances: [
      'what makes it worse',
      'does anything provoke the pain',
      'what aggravates it',
      'anything make it worse',
      'provoking factors',
      'what triggers it',
    ],
  },
  {
    intent: 'ask.palliatives',
    utterances: [
      'what makes it better',
      'does anything relieve the pain',
      'what helps',
      'anything make it better',
      'what provides relief',
      'palliating factors',
    ],
  },
  {
    intent: 'ask.quality',
    utterances: [
      'can you describe the pain',
      'what does it feel like',
      'is it sharp or dull',
      'describe the quality of pain',
      'what type of pain is it',
      'how would you describe it',
    ],
  },
  {
    intent: 'ask.region',
    utterances: [
      'where does it hurt',
      'where is the pain',
      'point to where it hurts',
      'location of pain',
      'what area hurts',
      'show me where it hurts',
    ],
  },
  {
    intent: 'ask.radiation',
    utterances: [
      'does the pain spread',
      'does it radiate anywhere',
      'does the pain move',
      'does it travel to other areas',
      'any radiating pain',
    ],
  },
  {
    intent: 'ask.severity',
    utterances: [
      'how bad is the pain',
      'on a scale of 1 to 10',
      'rate your pain',
      'pain level',
      'how severe is it',
      'how bad is the pain on a scale of 1 to 10',
      'severity of pain',
    ],
  },
  {
    intent: 'ask.intensityTrend',
    utterances: [
      'is it getting worse',
      'is it getting better',
      'has the pain changed',
      'is it the same or different',
      'intensity trend',
      'how has it changed',
    ],
  },
  {
    intent: 'ask.normality',
    utterances: [
      'is this normal for you',
      'does this usually happen',
      'is this typical',
      'has this happened before',
      'is this usual',
    ],
  },
  {
    intent: 'ask.happenedBefore',
    utterances: [
      'has this happened before',
      'is this the first time',
      'have you experienced this before',
      'recurrent problem',
      'first occurrence',
    ],
  },
  {
    intent: 'ask.chiefComplaint',
    utterances: [
      'what is your main problem',
      'what brings you here',
      'chief complaint',
      'primary concern',
      'what is bothering you most',
      'main issue',
    ],
  },
  {
    intent: 'ask.time',
    utterances: [
      'what time is it',
      'do you know what day it is',
      'what is the date',
      'can you tell me the time',
    ],
  },
  {
    intent: 'ask.place',
    utterances: [
      'where are you',
      'do you know where you are',
      'what is this place',
      'can you tell me where we are',
    ],
  },
  {
    intent: 'ask.injury',
    utterances: [
      'did you hurt yourself',
      'are you injured',
      'do you have an injury',
      'where are you injured',
    ],
  },
]

/**
 * Control/stabilization intents
 */
export const controlIntents: TrainingDocument[] = [
  {
    intent: 'control.spine',
    utterances: [
      'hold c-spine',
      'stabilize the spine',
      'manual inline stabilization',
      'control the spine',
      'hold the head and neck',
      'cervical spine control',
      'maintain spinal alignment',
      'immobilize the spine',
      'hold their head still',
      'stabilize c-spine',
    ],
  },
  {
    intent: 'control.head',
    utterances: [
      'stabilize the head',
      'hold the head',
      'control the head',
      'immobilize the head',
      'keep the head still',
    ],
  },
]

/**
 * Palpate intents
 */
export const palpateIntents: TrainingDocument[] = [
  {
    intent: 'palpate.bodypart',
    utterances: [
      'palpate the area',
      'feel the injured area',
      'press on it gently',
      'palpate for tenderness',
      'feel their chest',
      'palpate the stomach',
      'feel their back',
      'palpate the injury',
      'press on the leg',
      'feel for deformity',
    ],
  },
]

/**
 * Instruct intents
 */
export const instructIntents: TrainingDocument[] = [
  {
    intent: 'instruct.dontMove',
    utterances: [
      'tell them not to move',
      "don't move",
      'stay still',
      'remain still',
      'keep still',
      "tell the patient don't move",
      'instruct to not move',
      'hold still please',
    ],
  },
  {
    intent: 'instruct.acceptCare',
    utterances: [
      'ask for consent',
      'can I help you',
      'will you accept care',
      'do you want help',
      'let me help you',
      'ask to provide care',
    ],
  },
  {
    intent: 'instruct.breathe',
    utterances: [
      'take a deep breath',
      'breathe deeply',
      'slow your breathing',
      'calm down and breathe',
      'relax and breathe',
      'tell them to breathe',
    ],
  },
]

/**
 * Perform intents (procedures/assessments)
 */
export const performIntents: TrainingDocument[] = [
  {
    intent: 'perform.bloodSweep',
    utterances: [
      'do a blood sweep',
      'check for blood',
      'sweep for bleeding',
      'look for blood',
      'perform blood sweep',
      'check for external bleeding',
      'search for blood',
    ],
  },
  {
    intent: 'perform.focusedSpineAssessment',
    utterances: [
      'focused spine assessment',
      'check the spine',
      'assess the spinal column',
      'examine the spine',
      'spine assessment',
      'palpate the spine',
    ],
  },
  {
    intent: 'perform.passiveRangeOfMotionAssessment',
    utterances: [
      'passive range of motion',
      'move their arm for them',
      'passive rom test',
      'check passive movement',
    ],
  },
  {
    intent: 'perform.activeRangeOfMotionAssessment',
    utterances: [
      'active range of motion',
      'can you move your arm',
      'active rom test',
      'have them move',
      'ask them to move',
    ],
  },
]

/**
 * Apply/treatment intents
 */
export const applyIntents: TrainingDocument[] = [
  {
    intent: 'apply.splint',
    utterances: [
      'apply a splint',
      'splint the injury',
      'put on a splint',
      'immobilize with splint',
      'splint the leg',
      'splint the arm',
      'apply splinting',
      'stabilize with a splint',
    ],
  },
]

/**
 * Move intents
 */
export const moveIntents: TrainingDocument[] = [
  {
    intent: 'move.in',
    utterances: [
      'move closer',
      'approach the patient',
      'get closer',
      'move in',
      'go to the patient',
      'come closer',
      'walk up to them',
      'approach',
    ],
  },
]

/**
 * Survey intents
 */
export const surveyIntents: TrainingDocument[] = [
  {
    intent: 'survey.environment',
    utterances: [
      'survey the scene',
      'check for hazards',
      'is it safe',
      'scene safety',
      'look for dangers',
      'assess the environment',
      'check if its safe',
    ],
  },
]

/**
 * All training documents combined
 */
export const allTrainingDocuments: TrainingDocument[] = [
  ...measureIntents,
  ...lookIntents,
  ...askSampleIntents,
  ...askOpqrstIntents,
  ...controlIntents,
  ...palpateIntents,
  ...instructIntents,
  ...performIntents,
  ...applyIntents,
  ...moveIntents,
  ...surveyIntents,
]

