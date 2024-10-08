import { Pool, Query, QueryResult } from 'pg'
import { Restaurant } from '../restaurant/model'
import { CacheService } from './cache'
import { POSTGRES_CONNECTION_STRING } from './environment'
import { featureFlags } from './featureFlag'

export class DatabaseService {
  private static instance: DatabaseService
  private pool: Pool | undefined
  private static cacheService: CacheService

  private constructor() {
    if (featureFlags.dbPersistence) {
      this.pool = new Pool({ connectionString: POSTGRES_CONNECTION_STRING })
    }
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService()
      DatabaseService.cacheService = CacheService.getInstance()
    }
    return DatabaseService.instance
  }

  private async executeQuery(
    query: string,
    params: any[] = []
  ): Promise<QueryResult<any> | null> {
    try {
      if (!featureFlags.dbPersistence) {
        console.info('Database persistence is disabled in feature flags')
        return Promise.resolve(null)
      }

      if (!this.pool) {
        throw new Error('Database connection pool is not initialized')
      }

      const client = await this.pool.connect()
      const result = await client.query(query, params)
      client.release()
      return result
    } catch (error) {
      console.error('Error executing query:', error)
      throw error
    }
  }

  public async saveRecommendation(
    date: string,
    location: string,
    restaurant: Restaurant
  ): Promise<void> {
    const query =
      'INSERT INTO recommendations (date, location, restaurantId, restaurantName) VALUES ($1, $2, $3)'
    await this.executeQuery(query, [date, location, JSON.stringify(restaurant)])
    console.info(`Saved recommendation for ${date} and ${location}`, restaurant)

    DatabaseService.cacheService?.set(date, location, restaurant)
  }

  public async getRecommendation(
    date: string,
    location: string
  ): Promise<Restaurant | null> {
    const cachedRestaurant = await DatabaseService.cacheService?.get(
      date,
      location
    )

    if (cachedRestaurant) {
      return JSON.parse(cachedRestaurant)
    }

    const query =
      'SELECT value FROM recommendations WHERE date = $1 AND location = $2'
    const result = await this.executeQuery(query, [date, location])
    const restaurant = result?.rows.length
      ? JSON.parse(result.rows[0].restaurant)
      : null
    console.info(`Got restaurant for ${date} and ${location}:`, restaurant)

    return restaurant
  }
}
