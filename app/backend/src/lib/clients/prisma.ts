// TODO: Make this singleton pattern more robust by ripping off Papa Hirsch
import { PrismaClient } from '@prisma/client'

export const prismaClient = new PrismaClient()
