import { z } from 'zod'
import { LOCATIONS } from './constants'

export const LocationSchema = z.enum(LOCATIONS)

export type Location = z.infer<typeof LocationSchema>
