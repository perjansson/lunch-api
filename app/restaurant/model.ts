import { date, z } from 'zod'

export const RestaurantSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  address: z.string().optional(),
  exclude: z.boolean().optional(),
  distance: z.string().optional(),
  time: z.string().optional(),
  directions: z.string().optional(),
  quote: z.string().optional(),
})

export type Restaurant = z.infer<typeof RestaurantSchema>

export const SpreadsheetRestaurantSchema = z.array(
  z.union([z.string(), z.boolean()])
)

export const SpreadsheetRestaurantsSchema = z.object({
  values: z.array(SpreadsheetRestaurantSchema),
})

export const RecommendationSchema = z.object({
  name: z.string().min(1),
  quote: z.string().optional(),
})

export type Recommendation = z.infer<typeof RecommendationSchema>
