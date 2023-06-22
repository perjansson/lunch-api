import { sheets_v4 } from 'googleapis'
import { ConfigSchema, SpreadsheetConfigSchema } from './model'

export function validateConfig(data: sheets_v4.Schema$ValueRange) {
  const validationResult = SpreadsheetConfigSchema.safeParse(data)

  if (validationResult.success) {
    return validationResult.data.values[0][0]
  } else {
    console.error(
      `Invalid config found in Google Spreadsheet for location ${location}, will use default config: ${validationResult.error}`
    )

    return undefined
  }
}

export function parseConfig(configRaw: string) {
  const parsedConfig = ConfigSchema.safeParse({
    daysBetweenRestaurantCanAppearInRandomisation: parseInt(configRaw, 10),
  })

  if (parsedConfig.success) {
    return parsedConfig.data
  } else {
    console.error(`Could not parse config. Error: ${parsedConfig.error}`)
    return undefined
  }
}
