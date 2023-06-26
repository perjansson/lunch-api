import { Application, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { assertParams } from '../shared/middlewares'
import { z } from 'zod'
import { Location, LocationSchema } from '../shared/model'
import { getRandomRestaurant } from '../restaurant/controller'
import { Restaurant } from '../restaurant/model'

interface SlackRestaurantParams extends ParamsDictionary {
  location: Location
}

export function initSlackRoutes(app: Application) {
  app.post(
    '/api/:location/slack',
    assertParams(z.object({ location: LocationSchema })),
    async (req: Request<SlackRestaurantParams>, res: Response) => {
      try {
        const { location } = req.params
        const { team_domain } = req.body

        console.info('req.body', req.body)

        if (team_domain !== 'reaktor') {
          return res.status(401).send()
        }

        const randomRestaurant = await getRandomRestaurant(location)

        const message = randomRestaurant
          ? buildMessage(randomRestaurant)
          : "Sorry, I couldn't find any restaurants for today. :sad-toast:"

        const slackResponse = {
          response_type: 'in_channel',
          text: message,
        }

        res.send(JSON.stringify(slackResponse))
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Unknown error getting restaurant for Slack request'

        const slackResponse = {
          response_type: 'in_channel',
          text: `Oh snap: ${errorMessage}`,
        }

        res.send(JSON.stringify(slackResponse))
      }
    }
  )
}

function buildMessage(restaurant: Restaurant) {
  const { name, address, time, distance } = restaurant

  let message = `Today's restaurant is ${name}`

  if (address) {
    message += `, it's on ${address}`
  }
  if (time && distance) {
    message += ` and it takes ${time} to walk ${distance} there`
  } else if (time) {
    message += ` and it takes ${time} to walk there`
  } else if (distance) {
    message += ` and it is ${distance} away`
  }
  message += '. Bon appetit! :chefs-kiss:'

  return message
}
