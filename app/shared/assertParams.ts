import { NextFunction, Request, Response } from 'express'
import { ZodTypeAny, z } from 'zod'

export function assertParams<T extends ZodTypeAny>(
  schema: T
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params)

    if (result.success) {
      req.params = result.data
      next()
    } else {
      res.status(404).json({ error: result.error.message })
    }
  }
}
