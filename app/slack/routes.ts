import e, { Application, Request, Response } from 'express'
import NodeGeocoder, { Entry } from 'node-geocoder'
import geoTz from 'geo-tz'
import { format } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { LocationSchema } from '../shared/model'
import { getRandomRestaurant } from '../restaurant/controller'
import { Restaurant } from '../restaurant/model'
import { OFFICES } from '../shared/constants'
import { DatabaseService } from '../shared/db'

const db = DatabaseService.getInstance()

export function initSlackRoutes(app: Application) {
  app.post('/api/slack', async (req: Request, res: Response) => {
    //   try {
    //     console.info(`Slack request`, JSON.stringify(req.body))
    //     const { team_domain } = req.body
    //     if (team_domain !== 'reaktor') {
    //       return res.status(401).send()
    //     }
    //     const location = req.body.text.trim()
    //     const parsedLocation = LocationSchema.safeParse(location)
    //     console.info(`Parsed location for ${location}:`, parsedLocation)
    //     if (!parsedLocation.success) {
    //       return res.send(
    //         `Please provide a valid location, i.e. '/lunch ${OFFICES.join(
    //           ' | '
    //         )}'`
    //       )
    //     }
    //     const coordinates = await getLocationCoordinates(location)
    //     console.info(`Coordinates for ${location}:`, coordinates)
    //     if (!coordinates) {
    //       return res.send(
    //         `Sorry, I couldn't find any coordinates for the location ${location} :sad-toast:`
    //       )
    //     }
    //     const isoDate = getCurrentISODate(coordinates)
    //     console.info(`ISO date for ${location}:`, isoDate)
    //     if (!isoDate) {
    //       return res.send(
    //         `Sorry, I couldn't find any current date for the location ${location} and coordinates ${JSON.stringify(
    //           coordinates
    //         )} :sad-toast:`
    //       )
    //     }
    //     let restaurant = await db.getRecommendation(isoDate, location)
    //     if (!restaurant) {
    //       restaurant = await getRandomRestaurant(location)
    //       console.info(`Random restaurant for ${location}:`, restaurant)
    //       if (restaurant) {
    //         db.saveRecommendation(isoDate, location, restaurant)
    //       }
    //     }
    //     const message = restaurant
    //       ? buildMessage(restaurant)
    //       : "Sorry, I couldn't find any restaurants for today. :sad-toast:"
    //     console.info(`Message for ${location}:`, message)
    //     const slackResponse = {
    //       response_type: 'in_channel',
    //       text: message,
    //     }
    //     res.send(JSON.stringify(slackResponse))
    //   } catch (error) {
    //     const errorMessage =
    //       error instanceof Error
    //         ? error.message
    //         : 'Unknown error getting restaurant for Slack request'
    //     const slackResponse = {
    //       response_type: 'in_channel',
    //       text: `Oh snap: ${errorMessage}`,
    //     }
    //     res.send(JSON.stringify(slackResponse))
    //   }
  })
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

interface Coordinates {
  latitude: number
  longitude: number
}

const geocoder = NodeGeocoder({
  provider: 'openstreetmap',
})

function getLocationCoordinates(location: string): Promise<Coordinates> {
  return new Promise<Coordinates>((resolve, reject) => {
    geocoder.geocode(location, (err: any, data: Entry[]) => {
      if (err || data.length === 0) {
        reject(err || new Error('No results found for the location'))
      } else {
        const { latitude, longitude } = data[0]

        if (!latitude || !longitude) {
          reject(new Error('No coordinates found for the location'))
        } else {
          resolve({ latitude, longitude })
        }
      }
    })
  })
}

function getCurrentISODate(coordinates: Coordinates): string {
  const currentDate = new Date()
  const { latitude, longitude } = coordinates
  const timeZone = geoTz.find(latitude, longitude)[0]
  const zonedDate = utcToZonedTime(currentDate, timeZone)
  const formattedDate = format(zonedDate, 'yyyy-MM-dd')
  return formattedDate
}
