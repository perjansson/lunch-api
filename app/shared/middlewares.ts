import { NextFunction, Request, Response } from 'express'
import { ZodTypeAny } from 'zod'
import { API_KEYS } from './environment'

export function assertParams<T extends ZodTypeAny>(
  schema: T
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params)

    if (result.success) {
      req.params = result.data
      next()
    } else {
      res.status(400).json({ error: result.error.message })
    }
  }
}

interface ValidateAPIOptions {
  exlucedPaths?: string[]
  exlucedOrigins?: string[]
}

export function validateAPI({
  exlucedPaths,
  exlucedOrigins,
}: ValidateAPIOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log(`Request path: ${req.path}`)
    console.log(`Request origin: ${req.headers.origin}`)
    console.log(`Request API key: ${req.headers['api-key']}`)

    if ((exlucedPaths ?? []).includes(req.path)) {
      return next()
    }

    if ((exlucedOrigins ?? []).includes(req.headers.origin ?? '')) {
      return next()
    }

    const apiKey = req.headers['api-key']
    if (!apiKey || typeof apiKey !== 'string' || !API_KEYS.includes(apiKey)) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    next()
  }
}
