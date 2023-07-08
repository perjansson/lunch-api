export const API_KEYS: string[] =
  process.env.NODE_ENV !== 'test'
    ? process.env.API_KEYS?.split(',') || []
    : ['test-api-key']

export const GOOGLE_APPLICATION_CREDENTIALS = JSON.parse(
  Buffer.from(
    process.env.GOOGLE_APPLICATION_CREDENTIALS || '',
    'base64'
  ).toString()
)

export const REDIS_CONNECTING_STRING = process.env.REDIS_CONNECTING_STRING
