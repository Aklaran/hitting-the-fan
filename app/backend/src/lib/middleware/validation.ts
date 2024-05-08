import logger from '@shared/util/logger'
import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { UnknownKeysParam, ZodError, ZodRawShape, z } from 'zod'

export function validateData(
  schema: z.ZodObject<ZodRawShape, UnknownKeysParam>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body)

      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          message: `Validation failed for ${issue.path.join('.')}. ${issue.message}`,
        }))

        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: 'Invalid data', details: errorMessages })
      } else {
        logger.error(error)

        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: 'Internal Server Error' })
      }
    }
  }
}
