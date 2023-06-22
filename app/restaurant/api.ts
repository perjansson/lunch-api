import { Location } from '../shared/model'
import { getSpreadSheetValues } from '../shared/spreadsheetReader'
import { Restaurant } from './model'
import { parseRestaurants, validateRestaurants } from './validator'

export async function getRestaurants(
  location: Location
): Promise<Restaurant[]> {
  const { data } = await getSpreadSheetValues(`${location}!A2:E`)

  const restaurantsRaw = validateRestaurants(data)
  if (restaurantsRaw === undefined) {
    return []
  }

  return parseRestaurants(restaurantsRaw)
}
