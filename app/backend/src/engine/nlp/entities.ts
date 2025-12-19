/**
 * Named Entity Definitions for NLP.js
 *
 * These entities allow the NLP parser to extract specific values
 * (like body parts, vitals, modifiers) from natural language input.
 */

/**
 * Body part entities with their natural language synonyms
 */
export const bodyPartEntities: Record<string, string[]> = {
  // CSM-capable parts (extremities)
  leftHand: ['left hand', 'left palm', 'left fingers'],
  rightHand: ['right hand', 'right palm', 'right fingers'],
  leftFoot: ['left foot', 'left toes', 'left sole'],
  rightFoot: ['right foot', 'right toes', 'right sole'],

  // Circulation-only parts
  neck: ['neck', 'throat', 'cervical area'],

  // Basic parts
  head: ['head', 'skull', 'cranium', 'scalp'],
  mouth: ['mouth', 'lips', 'oral cavity', 'jaw'],
  chest: ['chest', 'thorax', 'ribs', 'rib cage', 'sternum', 'breastbone'],
  stomach: ['stomach', 'abdomen', 'belly', 'abdominal area', 'tummy'],
  back: ['back', 'upper back', 'lower back', 'lumbar'],
  spine: ['spine', 'spinal column', 'vertebrae', 'c-spine', 'cervical spine'],
  hips: ['hips', 'pelvis', 'pelvic area', 'hip bones'],
  leftArm: ['left arm', 'left upper arm', 'left forearm', 'left elbow', 'left upper extremity'],
  rightArm: ['right arm', 'right upper arm', 'right forearm', 'right elbow', 'right upper extremity'],
  leftLeg: ['left leg', 'left thigh', 'left calf', 'left knee', 'left lower extremity', 'left shin'],
  rightLeg: ['right leg', 'right thigh', 'right calf', 'right knee', 'right lower extremity', 'right shin'],
}

/**
 * Vital sign / measurement target entities
 */
export const measureTargetEntities: Record<string, string[]> = {
  pulse: ['pulse', 'heart rate', 'heartbeat', 'bpm', 'beats per minute', 'radial pulse', 'carotid pulse'],
  respiration: ['respiration', 'breathing', 'respiratory rate', 'breaths', 'breath rate'],
  pupils: ['pupils', 'eyes', 'pupil response', 'pupillary response'],
  sensation: ['sensation', 'feeling', 'numbness', 'tingling', 'can you feel'],
  motion: ['motion', 'movement', 'range of motion', 'can you move'],
  skinTemperature: ['skin temperature', 'skin temp', 'how warm', 'temperature of skin'],
  skinColor: ['skin color', 'skin colour', 'complexion', 'pallor', 'cyanosis'],
  skinMoisture: ['skin moisture', 'sweating', 'diaphoresis', 'clammy'],
  temperature: ['temperature', 'temp', 'fever', 'body temperature'],
}

/**
 * Question target entities (SAMPLE + OPQRST + other history)
 */
export const questionTargetEntities: Record<string, string[]> = {
  // Basic info
  name: ['name', 'who are you', 'your name', 'called'],
  age: ['age', 'how old', 'years old'],
  gender: ['gender', 'sex', 'male or female'],

  // SAMPLE history
  allergies: ['allergies', 'allergic', 'allergy'],
  medications: ['medications', 'medicine', 'drugs', 'prescriptions', 'taking any medications'],
  lastIntakeOutput: ['last ate', 'last drank', 'last meal', 'eaten', 'intake', 'output', 'bathroom'],
  medicalTags: ['medical tags', 'medical bracelet', 'medical alert', 'medic alert', 'medical id'],

  // Medical conditions (DASH)
  diabetes: ['diabetes', 'diabetic', 'blood sugar', 'insulin'],
  asthma: ['asthma', 'inhaler', 'breathing problems', 'respiratory condition'],
  seizures: ['seizures', 'epilepsy', 'convulsions', 'fits'],
  heartConditions: ['heart condition', 'heart problems', 'cardiac', 'heart disease', 'heart attack'],

  // Events
  whatHappened: ['what happened', 'how did this happen', 'tell me what happened', 'events'],
  mechanismOfInjury: ['mechanism of injury', 'how were you injured', 'how did you get hurt', 'moi'],

  // OPQRST
  onset: ['onset', 'when did this start', 'when did it begin', 'how long', 'started'],
  provokers: ['provokers', 'what makes it worse', 'provokes', 'aggravates', 'worse when'],
  palliatives: ['palliatives', 'what makes it better', 'relieves', 'helps', 'better when'],
  quality: ['quality', 'describe the pain', 'what does it feel like', 'type of pain', 'sharp or dull'],
  region: ['region', 'where does it hurt', 'location of pain', 'where is the pain'],
  radiation: ['radiation', 'does it spread', 'radiates', 'moves to', 'travels'],
  referral: ['referral', 'referred pain', 'pain elsewhere'],
  severity: ['severity', 'how bad', 'scale of 1 to 10', 'pain level', 'pain scale', 'rate your pain'],
  intensityTrend: ['intensity trend', 'getting worse', 'getting better', 'same', 'changing'],
  normality: ['normal', 'is this normal', 'usual', 'typical'],
  happenedBefore: ['happened before', 'had this before', 'first time', 'recurrent'],
  chiefComplaint: ['chief complaint', 'main problem', 'primary concern', 'what brings you here'],

  // Orientation
  time: ['time', 'what time is it', 'day', 'date'],
  place: ['place', 'where are you', 'location', 'where are we'],
  injury: ['injury', 'hurt', 'injured', 'wound'],
}

/**
 * Instruction target entities
 */
export const instructTargetEntities: Record<string, string[]> = {
  dontMove: ["don't move", 'do not move', 'stay still', 'remain still', 'keep still', 'hold still'],
  acceptCare: ['accept care', 'let me help', 'allow treatment', 'consent'],
  breathe: ['breathe', 'take a breath', 'deep breath', 'breathing', 'calm down'],
}

/**
 * Perform target entities (procedures/assessments)
 */
export const performTargetEntities: Record<string, string[]> = {
  bloodSweep: ['blood sweep', 'check for blood', 'blood check', 'sweep for blood', 'look for bleeding'],
  focusedSpineAssessment: ['focused spine assessment', 'spine check', 'spinal assessment', 'check the spine'],
  passiveRangeOfMotionAssessment: ['passive range of motion', 'passive rom', 'move their arm', 'move their leg'],
  activeRangeOfMotionAssessment: ['active range of motion', 'active rom', 'can you move', 'move your arm'],
  activityRangeOfMotionAssessment: ['activity range of motion', 'activity rom', 'functional movement'],
}

/**
 * Apply/treatment target entities
 */
export const applyTargetEntities: Record<string, string[]> = {
  splint: ['splint', 'splinting', 'immobilize', 'immobilization', 'stabilize limb'],
}

/**
 * Move target entities
 */
export const moveTargetEntities: Record<string, string[]> = {
  in: ['closer', 'approach', 'move in', 'get closer', 'move closer', 'come closer', 'go to patient'],
}

/**
 * Modifier entities
 */
export const modifierEntities: Record<string, string[]> = {
  tight: ['tight', 'tightly', 'firm', 'firmly', 'snug'],
  loose: ['loose', 'loosely', 'gentle', 'gently'],
  remove: ['remove', 'take off', 'undo'],
  obstruction: ['obstruction', 'blockage', 'blocked', 'obstructed'],
}

/**
 * All entities combined for easy iteration
 */
export const allEntities = {
  bodypart: bodyPartEntities,
  measureTarget: measureTargetEntities,
  questionTarget: questionTargetEntities,
  instructTarget: instructTargetEntities,
  performTarget: performTargetEntities,
  applyTarget: applyTargetEntities,
  moveTarget: moveTargetEntities,
  modifier: modifierEntities,
}

