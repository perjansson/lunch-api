import { Application } from 'express'
import { z } from 'zod'
import { getRestaurants } from './api'
import { Location, LocationSchema } from '../shared/model'
import { assertParams } from '../shared/assertParams'

export function initRestaurantRoutes(app: Application) {
  app.get(
    '/:location/restaurants',
    assertParams(z.object({ location: LocationSchema })),
    async (req, res) => {
      const { location } = req.params as { location: Location }
      const restaurants = (await getRestaurants(location)).filter(
        (r) => r.exclude === null || !r.exclude
      )

      res.send(JSON.stringify(restaurants))
    }
  )
}
