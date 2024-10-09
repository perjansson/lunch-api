import { Application, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { z } from 'zod'
import {
  getRandomRestaurant,
  getRecommendation,
  getRestaurant,
  getRestaurants,
  saveRecommendation,
} from './controller'
import { Location, LocationSchema } from '../shared/model'
import { assertParams } from '../shared/middlewares'
import { getQuoteForRestaurant } from '../shared/openai'

// const db = DatabaseService.getInstance()

interface RestaurantsParams extends ParamsDictionary {
  location: Location
}

interface RestaurantParams extends ParamsDictionary {
  location: Location
  restaurantId: string
}

interface RandomRestaurantParams extends ParamsDictionary {
  location: Location
}

export function initRestaurantRoutes(app: Application) {
  app.get(
    '/api/:location/restaurants',
    assertParams(z.object({ location: LocationSchema })),
    async (req: Request<RestaurantsParams>, res: Response) => {
      try {
        const { location } = req.params

        const restaurants = await getRestaurants(location)
        if (!restaurants) {
          return res.status(404).send()
        }

        const includedRestaurants = restaurants.filter(
          (r) => r.exclude === null || !r.exclude
        )

        res.send(JSON.stringify(includedRestaurants))
      } catch (error) {
        res
          .status(500)
          .send(
            error instanceof Error
              ? error.message
              : 'Unknown error getting restaurants'
          )
      }
    }
  )

  app.get(
    '/api/:location/restaurants/:id',
    assertParams(z.object({ location: LocationSchema, id: z.string() })),
    async (req: Request<RestaurantParams>, res: Response) => {
      try {
        const { location, id } = req.params

        const restaurant = await getRestaurant(location, id)
        if (!restaurant) {
          return res.status(404).send()
        }

        res.send(JSON.stringify(restaurant))
      } catch (error) {
        res
          .status(500)
          .send(
            error instanceof Error
              ? error.message
              : `Unknown error getting restaurnt with id ${req.params.id}`
          )
      }
    }
  )

  app.get(
    '/api/:location/restaurant',
    assertParams(z.object({ location: LocationSchema })),
    async (req: Request<RandomRestaurantParams>, res: Response) => {
      try {
        const { location } = req.params
        const { isoDate } = req.query

        if (isoDate) {
          try {
            const recommendation = await getRecommendation(
              location,
              isoDate as string
            )

            if (recommendation) {
              return res.send(recommendation)
            }
          } catch (error) {
            // Just ignore the error if there's an issue getting the recommendation
          }
        }

        const randomRestaurant = await getRandomRestaurant(location)
        if (!randomRestaurant) {
          return res.status(404).send()
        }

        const quote = await getQuoteForRestaurant(
          randomRestaurant,
          LocationSchema.parse(location)
        )

        if (isoDate) {
          try {
            await saveRecommendation(
              location,
              isoDate as string,
              randomRestaurant,
              quote
            )
          } catch (error) {
            // Just ignore the error if there's an issue saving the recommendation
          }
        }

        const randomRestaurantWithOrWithoutQuote = {
          ...randomRestaurant,
          quote,
        }

        res.send(JSON.stringify(randomRestaurantWithOrWithoutQuote))
      } catch (error) {
        res
          .status(500)
          .send(
            error instanceof Error
              ? error.message
              : 'Unknown error getting random restaurant'
          )
      }
    }
  )
}
