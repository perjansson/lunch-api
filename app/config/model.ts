import { z } from 'zod'

export const ConfigSchema = z.object({
  daysBetweenRestaurantCanAppearInRandomisation: z.number(),
})

export type Config = z.infer<typeof ConfigSchema>

export const SpreadsheetConfigSchema = z.object({
  values: z.array(z.array(z.string())),
})
