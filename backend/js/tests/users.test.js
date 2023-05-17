const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const mongoose = require('mongoose')
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
})

describe('creating users', () => {
  test('works fine when fine', async () => {
    const goodUser = {
      username: 'joo',
      password: 'joo'
    }
    await api
      .post('/api/users')
      .send(goodUser)
      .expect(201)
  })

  test('username must have correct size', async () => {
    const tooShortUsername = {
      username: 'jo',
      password: 'joo'
    }
    await api
      .post('/api/users')
      .send(tooShortUsername)
      .expect(400)
  })

  test('password must have correct size', async () => {
    const tooShortPass = {
      username: 'joo',
      password: 'jo'
    }
    await api
      .post('/api/users')
      .send(tooShortPass)
      .expect(400)
  })

  test('username must be unique', async () => {
    const usernameNotUnique = {
      username: 'joo',
      password: 'joo'
    }
    await api
      .post('/api/users')
      .send(usernameNotUnique)
      .expect(201)
    await api
      .post('/api/users')
      .send(usernameNotUnique)
      .expect(400)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})