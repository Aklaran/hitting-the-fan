import logger from '@shared/util/logger'
import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'
import { validateData } from './validation'

jest.mock('@shared/util/logger')

describe('validateData', () => {
  const schema = z.object({
    name: z.string(),
    age: z.number(),
  })

  const mockRequest = (body: unknown) =>
    ({
      body,
    }) as Request

  const mockResponse = () => {
    const res: Partial<Response> = {}
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    return res as Response
  }

  const nextFunction = jest.fn()

  it('should call next() if validation is successful', () => {
    const req = mockRequest({ name: 'John Doe', age: 30 })
    const res = mockResponse()

    validateData(schema)(req, res, nextFunction)

    expect(nextFunction).toHaveBeenCalled()
  })

  it('should return a 400 error if validation fails', () => {
    const req = mockRequest({ name: 'John Doe', age: 'thirty' })
    const res = mockResponse()

    validateData(schema)(req, res, nextFunction)

    expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid data',
      details: expect.any(Array),
    })
  })

  it('should log the error and return a 500 error if an unexpected error occurs', () => {
    const error = new Error('Unexpected error')
    const req = mockRequest({ name: 'John Doe', age: 30 })
    const res = mockResponse()

    jest.spyOn(schema, 'parse').mockImplementation(() => {
      throw error
    })

    validateData(schema)(req, res, nextFunction)

    expect(logger.error).toHaveBeenCalledWith(error)
    expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Internal Server Error',
    })
  })
})
