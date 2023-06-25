import request from 'supertest'
import { app } from '../../app'

describe('Route /location/restaurants', () => {
  test('should return correct restaurants for location', async () => {
    const response = await request(app)
      .get('/api/api-test-data-location/restaurants')
      .set('api-key', 'test-api-key')
    expect(response.status).toBe(200)

    const parsedResponse = JSON.parse(response.text)
    expect(parsedResponse).toEqual([
      {
        id: '1',
        name: 'Restaurant 1',
        exclude: false,
        distance: '1 km',
        time: '15 min',
      },
      {
        id: '3',
        name: 'Restaurant 3',
        exclude: false,
        distance: '',
        time: '22 min',
      },
      { id: '4', name: 'Restaurant 4', exclude: false, distance: '1,0 km' },
      { id: '6', name: 'Restaurant 6', exclude: false },
    ])
  })

  test('should return correct restaurant details for specific restaurant', async () => {
    const response = await request(app)
      .get('/api/api-test-data-location/restaurants/1')
      .set('api-key', 'test-api-key')
    expect(response.status).toBe(200)

    const parsedResponse = JSON.parse(response.text)
    expect(parsedResponse).toEqual({
      id: '1',
      name: 'Restaurant 1',
      exclude: false,
      distance: '1 km',
      time: '15 min',
    })
  })

  test('should return a random restaurant', async () => {
    const response = await request(app)
      .get('/api/api-test-data-location/restaurant')
      .set('api-key', 'test-api-key')
    expect(response.status).toBe(200)

    const parsedResponse = JSON.parse(response.text)
    expect(parsedResponse).toHaveProperty('id')
    expect(parsedResponse).toHaveProperty('name')
  })

  test('should return 400 for invalid location', async () => {
    const response = await request(app)
      .get('/api/invalid-location/restaurants')
      .set('api-key', 'test-api-key')
    expect(response.status).toBe(400)
  })

  test('should return 401 for missing api-key', async () => {
    const response = await request(app).get('/api/invalid-location/restaurants')
    expect(response.status).toBe(401)
  })
})
