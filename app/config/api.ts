import { DEFAULT_DAYS_BETWEEN_RESTAURANT_CAN_APPEAR_IN_RANDOMISATION } from '../shared/constants'
import { Location } from '../shared/model'
import { getSpreadSheetValues } from '../shared/spreadsheetReader'
import { Config } from './model'
import { validateConfig, parseConfig } from './validator'

const DEFAULT_CONFIG = {
  daysBetweenRestaurantCanAppearInRandomisation:
    DEFAULT_DAYS_BETWEEN_RESTAURANT_CAN_APPEAR_IN_RANDOMISATION,
}

export async function getConfig(location: Location): Promise<Config> {
  const { data } = await getSpreadSheetValues(`${location}!I2`)

  const configRaw = validateConfig(data)
  if (configRaw === undefined) {
    return DEFAULT_CONFIG
  }

  return parseConfig(configRaw) || DEFAULT_CONFIG
}
