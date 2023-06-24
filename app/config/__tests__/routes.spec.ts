import request from 'supertest'
import { app } from '../../app'

describe('Route /location/config', () => {
  test('should return correct config for location', async () => {
    const response = await request(app).get('/api-test-data-location/config')
    expect(response.status).toBe(200)

    const parsedResponse = JSON.parse(response.text)
    expect(parsedResponse).toEqual({
      daysBetweenRestaurantCanAppearInRandomisation: 5,
    })
  })

  test('should return 400 for invalid location', async () => {
    const response = await request(app).get('/invalid-location/config')
    expect(response.status).toBe(400)
  })
})
