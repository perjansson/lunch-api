import { Application } from 'express'
import { z } from 'zod'
import { Location, LocationSchema } from '../shared/model'
import { getConfig } from './api'
import { assertParams } from '../shared/assertParams'

export function initConfigRoutes(app: Application) {
  app.get(
    '/:location/config',
    assertParams(z.object({ location: LocationSchema })),
    async (req, res) => {
      const { location } = req.params as { location: Location }
      const config = await getConfig(location)

      res.send(JSON.stringify(config))
    }
  )
}
