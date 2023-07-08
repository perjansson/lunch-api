import Redis from 'ioredis'

export class CacheService {
  private redisClient: Redis

  constructor(connectionString: string) {
    this.redisClient = new Redis(connectionString)
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
