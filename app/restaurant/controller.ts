import { Location } from '../shared/model'
import { getSpreadSheetValues } from '../shared/spreadsheetReader'
import { Restaurant } from './model'
import { parseRestaurants, validateRestaurants } from './validator'

export async function getRestaurants(
  location: Location
): Promise<Restaurant[] | undefined> {
  const values = await getSpreadSheetValues(`${location}!A2:E`)
  if (!values) {
    return undefined
  }

  const restaurantsRaw = validateRestaurants(values)
  if (restaurantsRaw === undefined) {
    return []
  }

  return parseRestaurants(restaurantsRaw)
}

export async function getRestaurant(
  location: Location,
  id: string
): Promise<Restaurant | undefined> {
  const restaurants = await getRestaurants(location)
  if (!restaurants) {
    return undefined
  }

  return restaurants.find((r) => r.id === id)
}

export async function getRandomRestaurant(
  location: Location
): Promise<Restaurant | undefined> {
  const restaurants = await getRestaurants(location)
  if (!restaurants || restaurants.length === 0) {
    return undefined
  }

  const includedRestaurants = restaurants.filter(
    (r) => r.exclude === null || !r.exclude
  )

  return includedRestaurants[
    Math.floor(Math.random() * includedRestaurants.length)
  ]
}
