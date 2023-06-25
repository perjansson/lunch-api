import request from 'supertest'
import { app } from '../../app'

describe('Route /location/config', () => {
  test('should return correct config for location', async () => {
    const response = await request(app)
      .get('/api/api-test-data-location/config')
      .set('api-key', 'test-api-key')
    expect(response.status).toBe(200)

    const parsedResponse = JSON.parse(response.text)
    expect(parsedResponse).toEqual({
      daysBetweenRestaurantCanAppearInRandomisation: 5,
    })
  })

  test('should return 400 for invalid location', async () => {
    const response = await request(app)
      .get('/api/invalid-location/config')
      .set('api-key', 'test-api-key')
    expect(response.status).toBe(400)
  })

  test('should return 401 for incorrect api-key', async () => {
    const response = await request(app)
      .get('/api/invalid-location/restaurants')
      .set('api-key', 'incorrect-test-api-key')
    expect(response.status).toBe(401)
  })
})
