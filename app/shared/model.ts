import { z } from 'zod'

export const LocationSchema = z.enum([
  'turku',
  'newyork',
  'tampere',
  'helsinki',
  'amsterdam',
  'tokyo',
  'stockholm',
  'lisbon',
  'seinajoki',
  'api-test-data-location', // Used only for testing
])

export type Location = z.infer<typeof LocationSchema>
