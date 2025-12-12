import { PrismaClient } from '@prisma/client'
import { flashcards } from './flashcards'
import { scenarios } from './scenarios'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding flashcards...')
  console.log(`Found ${flashcards.length} flashcards to seed.\n`)

  let seededFlashcards = 0
  for (const flashcard of flashcards) {
    try {
      await prisma.flashcard.upsert({
        where: { key: flashcard.key },
        create: flashcard,
        update: flashcard,
      })
      seededFlashcards++
      console.log(`Seeded flashcard ${flashcard.key}.`)
    } catch (error) {
      console.error(`Error seeding flashcard ${flashcard.key}: ${error}`)
    }
  }

  const flashcardWord = seededFlashcards === 1 ? 'flashcard' : 'flashcards'
  console.log(`\n${seededFlashcards} ${flashcardWord} seeded successfully.`)

  if (seededFlashcards < flashcards.length) {
    const failedCount = flashcards.length - seededFlashcards
    const flashcardWord = failedCount === 1 ? 'flashcard' : 'flashcards'
    throw new Error(`${failedCount} ${flashcardWord} failed to seed.`)
  }

  console.log('\nSeeding scenarios...')

  console.log(`Found ${scenarios.length} scenarios to seed.\n`)

  let seededScenarios = 0
  for (const scenario of scenarios) {
    try {
      await prisma.scenario.upsert({
        where: { key: scenario.key },
        create: {
          key: scenario.key,
          title: scenario.title,
          openingPrompt: scenario.openingPrompt,
          initialState: scenario.initialState,
          perfectActions: scenario.perfectActions ?? [],
          badActions: scenario.badActions ?? undefined,
        },
        update: {
          title: scenario.title,
          openingPrompt: scenario.openingPrompt,
          initialState: scenario.initialState,
          perfectActions: scenario.perfectActions ?? [],
          badActions: scenario.badActions ?? undefined,
        },
      })
      seededScenarios++
      console.log(`Seeded scenario ${scenario.key}.`)
    } catch (error) {
      console.error(`Error seeding scenario ${scenario.key}: ${error}`)
    }
  }

  const scenarioWord = seededScenarios === 1 ? 'scenario' : 'scenarios'
  console.log(`\n${seededScenarios} ${scenarioWord} seeded successfully.`)

  if (seededScenarios < scenarios.length) {
    const failedCount = scenarios.length - seededScenarios
    const scenarioWord = failedCount === 1 ? 'scenario' : 'scenarios'
    throw new Error(`${failedCount} ${scenarioWord} failed to seed.`)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
