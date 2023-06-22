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
  'api-test-data',
])

export type Location = z.infer<typeof LocationSchema>
