import { CreateFlashcardSchema } from '@shared/types/flashcard'

const wrapAnkleFlashcard: CreateFlashcardSchema = {
  key: 'wrap-ankle',
  question: 'How do you wrap an ankle?',
  answer:
    'Start by placing the ankle in a neutral 90-degree position. Begin wrapping from the arch of the foot, moving up toward the ankle. Use a figure-8 pattern: wrap under the arch, up over the top of the foot, around the back of the ankle, across the front, and back down. Continue the figure-8 pattern, overlapping each wrap by half its width. Secure the wrap with tape or clips, ensuring it is snug but not too tight to restrict circulation.',
}

const applyTourniquetFlashcard: CreateFlashcardSchema = {
  key: 'apply-tourniquet',
  question: 'How do you apply a tourniquet?',
  answer:
    'Apply the tourniquet 2-3 inches above the injury site, never directly over a joint. Tighten the tourniquet until bleeding stops. Document the time of application. Do not cover the tourniquet with clothing. Once applied, do not remove until definitive care is available. Monitor the patient closely and check distal pulses if possible. Tourniquets should be wide (at least 2 inches) to distribute pressure and minimize tissue damage.',
}

const administerCprFlashcard: CreateFlashcardSchema = {
  key: 'administer-cpr',
  question: 'How do you administer CPR?',
  answer:
    'Check for responsiveness and breathing. Call for help and begin chest compressions immediately. Place hands on the center of the chest (lower half of sternum), position your shoulders over your hands, and compress at least 2 inches deep at a rate of 100-120 compressions per minute. After 30 compressions, give 2 rescue breaths (if trained) by tilting the head back, pinching the nose, and breathing into the mouth. Continue cycles of 30 compressions to 2 breaths. Continue until help arrives or the person shows signs of life.',
}

export const flashcards = [
  wrapAnkleFlashcard,
  applyTourniquetFlashcard,
  administerCprFlashcard,
]
