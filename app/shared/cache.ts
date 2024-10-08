import Redis from 'ioredis'
import { REDIS_CONNECTING_STRING } from './environment'
import { Restaurant } from '../restaurant/model'
import { featureFlags } from './featureFlag'

export class CacheService {
  private static instance: CacheService
  private redisClient: Redis | undefined

  private constructor(connectionString: string) {
    if (featureFlags.cache) {
      this.redisClient = new Redis(connectionString)
    }
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance && REDIS_CONNECTING_STRING) {
      CacheService.instance = new CacheService(REDIS_CONNECTING_STRING)
    }
    return CacheService.instance
  }

  public async set(
    date: string,
    location: string,
    restaurant: Restaurant
  ): Promise<void> {
    const cacheKey = `${date}-${location}`
    await this.redisClient?.set(cacheKey, JSON.stringify(restaurant))
  }

  public async get(date: string, location: string): Promise<string | null> {
    try {
      const cacheKey = `${date}-${location}`
      console.info(`Looking in cache for key ${cacheKey}`)
      const result = await this.redisClient?.get(cacheKey)
      console.info(`Found ${result} for key ${cacheKey} in cache`)
      return result || null
    } catch (error) {
      console.error(
        `Error getting date ${date} and location ${location} from cache: ${error}`
      )
      return null
    }
  }
}
