const request = require('supertest')
const db = require('../db/connection')
const app = require('../app')
const data = require('../db/data/test-data')
const seed = require('../db/seeds/seed')

beforeEach(() => seed(data));
afterAll(() => db.end());

describe ('/api/does-not-exist', () => {
    test('GET 404: responds with 404 not found message for a non-existent endpoint', () => {
        return request(app)
        .get('/api/does-not-exist')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Not found')
        })
    })
})