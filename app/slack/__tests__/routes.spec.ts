import request from 'supertest'
import { app } from '../../app'

describe('Route /api/slack', () => {
  test('should return 401 for requests outside Reaktor slack', async () => {
    const response = await request(app).post('/api/slack')
    expect(response.status).toBe(401)
  })

  test.skip('should return 400 for requests without location', async () => {
    const response = await request(app)
      .post('/api/slack')
      .set('Content-Type', 'application/json')
      .send({ team_domain: 'reaktor' })
    expect(response.status).toBe(400)
  })
})
