import { Application, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { z } from 'zod'
import {
  getRandomRestaurant,
  getRestaurant,
  getRestaurants,
} from './controller'
import { Location, LocationSchema } from '../shared/model'
import { assertParams } from '../shared/middlewares'

interface RestaurantsParams extends ParamsDictionary {
  location: Location
}

export function initRestaurantRoutes(app: Application) {
  app.get(
    '/api/:location/restaurants',
    assertParams(z.object({ location: LocationSchema })),
    async (req: Request<RestaurantsParams>, res: Response) => {
      const { location } = req.params

      const restaurants = await getRestaurants(location)
      if (!restaurants) {
        return res.status(404).send()
      }

      const includedRestaurants = restaurants.filter(
        (r) => r.exclude === null || !r.exclude
      )

      res.send(JSON.stringify(includedRestaurants))
    }
  )

  interface RestaurantParams extends ParamsDictionary {
    location: Location
    restaurantId: string
  }

  app.get(
    '/api/:location/restaurants/:id',
    assertParams(z.object({ location: LocationSchema, id: z.string() })),
    async (req: Request<RestaurantParams>, res: Response) => {
      const { location, id } = req.params

      const restaurant = await getRestaurant(location, id)
      if (!restaurant) {
        return res.status(404).send()
      }

      res.send(JSON.stringify(restaurant))
    }
  )

  interface RandomRestaurantParams extends ParamsDictionary {
    location: Location
  }

  app.get(
    '/api/:location/restaurant',
    assertParams(z.object({ location: LocationSchema })),
    async (req: Request<RandomRestaurantParams>, res: Response) => {
      const { location } = req.params

      const randomRestaurant = await getRandomRestaurant(location)
      if (!randomRestaurant) {
        return res.status(404).send()
      }

      res.send(JSON.stringify(randomRestaurant))
    }
  )
}
