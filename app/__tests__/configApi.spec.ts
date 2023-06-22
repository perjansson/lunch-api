import request from 'supertest'
import { app } from '../app'

describe('Config endpoints', () => {
  test('GET /location/config should return a success message', async () => {
    const response = await request(app).get('/api-test-data/config')
    expect(response.status).toBe(200)

    const parsedResponse = JSON.parse(response.text)
    expect(parsedResponse).toEqual({
      daysBetweenRestaurantCanAppearInRandomisation: 5,
    })
  })
})
