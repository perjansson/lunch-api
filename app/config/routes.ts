import { Application } from 'express'
import { z } from 'zod'
import { Location, LocationSchema } from '../shared/model'
import { getConfig } from './controller'
import { assertParams } from '../shared/middlewares'

export function initConfigRoutes(app: Application) {
  app.get(
    '/api/:location/config',
    assertParams(z.object({ location: LocationSchema })),
    async (req, res) => {
      const { location } = req.params as { location: Location }
      const config = await getConfig(location)

      if (!config) {
        res.status(404).send()
      }

      res.send(JSON.stringify(config))
    }
  )
}
