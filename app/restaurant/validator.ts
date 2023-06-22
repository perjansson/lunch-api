import { sheets_v4 } from 'googleapis'
import {
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
        exclude: Boolean(row[2]),
        distance: row[3],
        time: row[4],
        directions: row[5],
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
