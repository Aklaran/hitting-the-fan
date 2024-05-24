// This file is necessary because Prisma's current implementation of mapped
// enums kind of sucks.
// See: https://github.com/prisma/prisma/issues/8446

import { State as PrismaState } from '@prisma/client'
import { MyGrade } from '@shared/types/srs'
import { State as FsrsState, Rating } from 'ts-fsrs'

export const FlashcardStateMap = {
  [PrismaState.New]: FsrsState.New,
  [PrismaState.Learning]: FsrsState.Learning,
  [PrismaState.Review]: FsrsState.Review,
  [PrismaState.Relearning]: FsrsState.Relearning,
}

export const FlashcardStateReverseMap = {
  [FsrsState.New]: PrismaState.New,
  [FsrsState.Learning]: PrismaState.Learning,
  [FsrsState.Review]: PrismaState.Review,
  [FsrsState.Relearning]: PrismaState.Relearning,
}

export const RatingMap = {
  [MyGrade.Again]: Rating.Again,
  [MyGrade.Hard]: Rating.Hard,
  [MyGrade.Good]: Rating.Good,
  [MyGrade.Easy]: Rating.Easy,
}
