export const SPREADSHEET_ID = '1cxojkskq9deUDuTWqa-XAIbE7Cnu41K3L1K83UkO7bk'

export const DEFAULT_DAYS_BETWEEN_RESTAURANT_CAN_APPEAR_IN_RANDOMISATION = 0

export const OFFICES = [
  'turku',
  'newyork',
  'tampere',
  'helsinki',
  'amsterdam',
  'tokyo',
  'stockholm',
  'lisbon',
  'seinajoki',
] as const

export const LOCATIONS = [
  ...OFFICES,
  'api-test-data-location', // Used only for testing
] as const

export const ALLOWED_ORIGINS = [
  'https://lunch-reaktor-web.fly.dev',
  'http://localhost:3000', // dev server of lunch-web
  'http://localhost:3001', // more dev server of lunch-web
  'http://localhost:8080', // api index.html
]
