import { Recommendation, Restaurant } from '../restaurant/model'
import { CacheService } from './cache'
import {
  getSpreadSheetValues,
  updateSpreadSheetValues,
} from '../shared/spreadsheet'
import { featureFlags } from './featureFlag'

export class DatabaseService {
  private static instance: DatabaseService
  private static cacheService: CacheService

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService()
      DatabaseService.cacheService = CacheService.getInstance()
    }
    return DatabaseService.instance
  }

  public async getRecommendation(
    location: string,
    date: string
  ): Promise<string[] | null> {
    const cachedRestaurant = await DatabaseService.cacheService?.get(
      date,
      location
    )

    if (cachedRestaurant) {
      return JSON.parse(cachedRestaurant)
    }

    try {
      const values = await getSpreadSheetValues(`${location}!M:O`)
      const existingRecommendation = values?.values?.find(
        (row) => row[0] === date
      )
      return existingRecommendation
        ? [existingRecommendation[1], existingRecommendation[2]]
        : null
    } catch (error) {
      const errorMessage = `Error getting historical recommendations by date ${date} in sheet ${location}:`

      console.error(
        errorMessage,
        error instanceof Error ? error.message : error
      )

      throw Error(errorMessage)
    }
  }

  public async saveRecommendation(
    location: string,
    date: string,
    restaurant: Restaurant,
    quote: string
  ): Promise<void> {
    try {
      const values = await getSpreadSheetValues(`${location}!M:O`)
      const nextRow = values?.values ? values.values.length + 1 : 1
      const newRow = [date, restaurant.name, quote]
      await updateSpreadSheetValues(`${location}!M${nextRow}:O${nextRow}`, [
        newRow,
      ])

      DatabaseService.cacheService?.set(date, location, restaurant)
    } catch (error) {
      const errorMessage = `Error saving recommendation for date ${date} in sheet ${location}:`

      console.error(
        errorMessage,
        error instanceof Error ? error.message : error
      )

      throw Error(errorMessage)
    }
  }
}
