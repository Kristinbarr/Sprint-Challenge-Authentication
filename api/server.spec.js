const request = require('supertest')
const server = require('./server')
const db = require('../database/dbConfig')
// const Users = require('../users/users-model')

describe('should be the correct database environment', () => {
  it('should set the testing environment', () => {
    expect(process.env.DB_ENV).toBe('testing')
  })
})

describe('/api/auth/register', () => {

  beforeEach(async () => {
    await db('users').truncate()
  })

  it('should return a 201 CREATED status code', async () => {
    const response = await request(server)
      .post('/api/auth/register')
      .send({ username: 'user1', password: 'pass' })
    expect(response.status).toBe(201)
  })

  it('should send back JSON', async () => {
    const response = await request(server)
      .post('/api/auth/register')
      .send({ username: 'user1', password: 'pass' })
    expect(response.type).toMatch(/json/i)
  })

  it('should send back saved user', async () => {
    const response = await request(server)
      .post('/api/auth/register')
      .send({ username: 'user1', password: 'pass' })
    expect(response.body.username).toBe('user1')
  })
})

describe('/api/auth/login', () => {

  it('should allow a registered user to log in', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .send({ username: 'user1', password: 'pass' })
    expect(response.status).toBe(200)
  })

  it('denies acces if user has incorrect credentials', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .send({ username: 'user1', password: 'notmypass' })
    expect(response.status).toBe(401)
  })
})

describe('/jokes', () => {
  it('should return 200 http status code', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .send({ username: 'user1', password: 'pass' })
    const jokes = await request(server)
      .get('/api/jokes')
      .set('Authorization', response.body.token)
    expect(jokes.status).toBe(200)
  })

  it('should return a list of jokes if user is signed in', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .send({ username: 'user1', password: 'pass' })
    const jokes = await request(server)
      .get('/api/jokes')
      .set('Authorization', response.body.token)
    expect(jokes.body)
  })
})
