import request from 'supertest'
import { app } from '../../app'

describe('Route /api/location/slack', () => {
  test('should return 401 for requests outside Reaktor slack', async () => {
    const response = await request(app).post(
      '/api/api-test-data-location/slack'
    )
    expect(response.status).toBe(401)
  })
})
