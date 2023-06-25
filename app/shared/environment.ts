export const API_KEYS: string[] =
  process.env.NODE_ENV !== 'test'
    ? process.env.API_KEYS?.split(',') || []
    : ['test-api-key']
