import { Restaurant } from '../restaurant/model'
import OpenAI from 'openai'
import { OPENAI_API_KEY } from './environment'
import { Location } from './model'
import { featureFlags } from './featureFlag'

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
})

export async function getQuoteForRestaurant(
  restaurant: Restaurant,
  location: Location
): Promise<String> {
  if (!featureFlags.openAiLunchQuote) {
    return 'Oops! Feature disabled. AI is out to lunch!'
  }

  const question = `Give a funny quote about this restaurant ${restaurant.name} in ${location}.`

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: question }],
    max_tokens: 150,
  })

  const quote = response.choices[0].message.content?.trim()
  if (!quote) {
    return `Oops! We couldn't get a quote from OpenAI for ${restaurant.name}. Maybe the AI is on a lunch break!`
  }

  return quote
}
