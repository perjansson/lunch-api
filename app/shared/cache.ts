import Redis from 'ioredis'

export class CacheService {
  private static instance: CacheService
  private redisClient: Redis

  private constructor(connectionString: string) {
    this.redisClient = new Redis(connectionString)
  }

  public static getInstance(connectionString: string): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService(connectionString)
    }
    return CacheService.instance
  }

  public async set(key: string, value: string): Promise<void> {
    await this.redisClient.set(key, value)
  }

  public async get(key: string): Promise<string | null> {
    try {
      console.info(`Looking in cache for key ${key}`)
      const result = await this.redisClient.get(key)
      console.info(`Found ${result} for key ${key} in cache`)
      return result
    } catch (error) {
      console.error(`Error getting key ${key} from cache: ${error}`)
      return null
    }
  }
}
