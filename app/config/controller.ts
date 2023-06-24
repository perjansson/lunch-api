import { DEFAULT_DAYS_BETWEEN_RESTAURANT_CAN_APPEAR_IN_RANDOMISATION } from '../shared/constants'
import { Location } from '../shared/model'
import { getSpreadSheetValues } from '../shared/spreadsheetReader'
import { Config } from './model'
import { validateConfig, parseConfig } from './validator'

const DEFAULT_CONFIG = {
  daysBetweenRestaurantCanAppearInRandomisation:
    DEFAULT_DAYS_BETWEEN_RESTAURANT_CAN_APPEAR_IN_RANDOMISATION,
}

export async function getConfig(
  location: Location
): Promise<Config | undefined> {
  const values = await getSpreadSheetValues(`${location}!I2`)
  if (!values) {
    return undefined
  }

  const configRaw = validateConfig(values)
  if (configRaw === undefined) {
    return DEFAULT_CONFIG
  }

  return parseConfig(configRaw) || DEFAULT_CONFIG
}
