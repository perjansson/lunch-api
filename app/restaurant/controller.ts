import { DatabaseService } from '../shared/db'
import { Location } from '../shared/model'
import { getSpreadSheetValues } from '../shared/spreadsheet'
import { Recommendation, Restaurant } from './model'
import {
  parseRecommendation,
  parseRestaurants,
  validateRestaurants,
} from './validator'

const db = DatabaseService.getInstance()

export async function getRestaurants(
  location: Location
): Promise<Restaurant[] | undefined> {
  const data = await getSpreadSheetValues(`${location}!A2:F`)
  if (!data || !data.values) {
    return undefined
  }

  const restaurantsRaw = validateRestaurants(data)
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
): Promise<Restaurant | null> {
  const restaurants = await getRestaurants(location)
  if (!restaurants || restaurants.length === 0) {
    return null
  }

  const includedRestaurants = restaurants.filter(
    (r) => r.exclude === null || !r.exclude
  )

  return includedRestaurants[
    Math.floor(Math.random() * includedRestaurants.length)
  ]
}

export async function getRecommendation(
  location: Location,
  date: string
): Promise<Recommendation | undefined> {
  const recommendationRaw = await db.getRecommendation(location, date)
  if (!recommendationRaw) {
    return undefined
  }

  return parseRecommendation(recommendationRaw[0], recommendationRaw[1])
}

export async function saveRecommendation(
  location: Location,
  date: string,
  restaurant: Restaurant,
  quote: string
): Promise<void> {
  await db.saveRecommendation(location, date, restaurant, quote)
}
