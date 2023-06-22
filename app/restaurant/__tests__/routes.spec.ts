import request from 'supertest'
import { app } from '../../app'

describe('Route /location/restaurants', () => {
  test('should return correct restaurants for location', async () => {
    const response = await request(app).get(
      '/api-test-data-location/restaurants'
    )
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

  test('should return 404 for invalid location', async () => {
    const response = await request(app).get('/invalid-location/restaurants')
    expect(response.status).toBe(404)
  })
})