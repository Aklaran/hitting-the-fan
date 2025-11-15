import { PrismaClient } from '@prisma/client'
import { scenarios } from './scenarios'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding scenarios...')
  console.log(`Found ${scenarios.length} scenarios to seed.\n`)

  let seededScenarios = 0
  for (const scenario of scenarios) {
    try {
      await prisma.scenario.upsert({
        where: { key: scenario.key },
        create: scenario,
        update: scenario,
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
