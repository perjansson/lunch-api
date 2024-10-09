import { sheets_v4 } from 'googleapis'
import {
  RecommendationSchema,
  Restaurant,
  RestaurantSchema,
  SpreadsheetRestaurantsSchema,
} from './model'

export function validateRestaurants(data: sheets_v4.Schema$ValueRange) {
  const validationResult = SpreadsheetRestaurantsSchema.safeParse(data)

  if (validationResult.success) {
    return validationResult.data.values
  } else {
    console.error(
      `Invalid restaurants found in Google Spreadsheet for location ${location}: ${validationResult.error}`
    )

    return undefined
  }
}

export function parseRestaurants(restaurantsRaw: (string | boolean)[][]) {
  if (restaurantsRaw === undefined || restaurantsRaw === null) {
    return []
  }

  const restaurants = restaurantsRaw
    ?.map((row, i) => {
      const parsedRestaurant = RestaurantSchema.safeParse({
        id: row[0],
        name: row[1],
        address: row[2],
        exclude: Boolean(row[3]),
        distance: row[4],
        time: row[5],
        directions: row[6],
      })

      if (parsedRestaurant.success) {
        return parsedRestaurant.data
      } else {
        console.info(
          `Could not parse restaurant at row ${i + 1}, will ignore it. Error: ${
            parsedRestaurant.error
          }`
        )
        return undefined
      }
    })
    .filter((parsedRow): parsedRow is Restaurant => parsedRow !== undefined)

  return restaurants
}

export function parseRecommendation(name: string, quote: string | undefined) {
  const recommendation = RecommendationSchema.safeParse({
    name,
    quote,
  })

  if (recommendation.success) {
    return recommendation.data
  } else {
    console.info(
      `Could not parse recommendation, will ignore it. Error: ${recommendation.error}`
    )
    return undefined
  }
}
