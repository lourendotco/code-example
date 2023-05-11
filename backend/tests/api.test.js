const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./tests_helper')

beforeAll(async () => {
  await helper.createTester()
})

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogs = helper.listWithManyBlog
    .map(n => new Blog(n).save())
  await Promise.all(blogs)
})

describe('bloglist', () => {
  test('in json?', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('correct amount', async () => {
    const res = await api
      .get('/api/blogs')
    expect(res.body).toHaveLength(helper.listWithManyBlog.length)
  })
})

describe('posts', () => {
  test('have an \'id\' property', async () => {
    const res = await api
      .get('/api/blogs')

    expect(res.body[0].id).toBeDefined()
  })

  test('can retrieve one with a valid id', async () => {
    const res = await api
      .get('/api/blogs')
    await api
      .get(`/api/blogs/${res.body[0].id}`)
      .expect(200)
  })

  test('can\'t delete one without permission', async () => {
    const initialBlogs = await api
      .get('/api/blogs')
    await api
      .delete(`/api/blogs/${initialBlogs.body[0].id}`)
      .expect(401)
  })

  test('can delete one', async () => {

    const token = await helper.getToken()
    const shortBlog = await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + token)
      .send(helper.listWithOneBlog[0])
      .expect(201)

    const newBlogs = await api
      .get('/api/blogs')

    expect(newBlogs.body).toHaveLength(helper.listWithManyBlog.length+1)

    await api
      .delete(`/api/blogs/${shortBlog.body.id}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(204)

    const finalBlogs = await api
      .get('/api/blogs')

    expect(finalBlogs.body).toHaveLength(helper.listWithManyBlog.length)

  })

  test('can\'t be posted without permission', async () => {
    await api
      .post('/api/blogs')
      .send(helper.listWithOneBlog[0])
      .expect(401)
  })

  test('can be posted', async () => {

    const token = await helper.getToken()

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + token)
      .send(helper.listWithOneBlog[0])
      .expect(201)

    const newBlogs = await api.get('/api/blogs')
    expect(newBlogs.body).toHaveLength(helper.listWithManyBlog.length+1)
  })

  test('have zero likes by default', async () => {
    const token = await helper.getToken()
    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + token)
      .send(helper.listWithOneBlog[0])
      .expect(201)

    const posted = await (await api.get('/api/blogs')).body
    expect(posted[posted.length-1].likes).toBe(0)
  })

  test('can be liked', async () => {
    const token = await helper.getToken()
    const aPost = await api
      .get('/api/blogs')
    console.log(aPost.body[2].id)
    await api
      .put(`/api/blogs/like/${aPost.body[2].id}`)
      .send({ vote: 1 })
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
    const anUpdatedPost = await api
      .get('/api/blogs')

    expect(anUpdatedPost.body[2].likes).toBe(aPost.body[2].likes+1)

  })

  test('title or url cannot be missing', async () => {
    const token = await helper.getToken()

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + token)
      .send(helper.blogNoURL)
      .expect(400)

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer ' + token)
      .send(helper.blogNoTitle)
      .expect(400)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})