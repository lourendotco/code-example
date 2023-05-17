const App = require('../app')
const supertest = require('supertest')
const API = supertest(App)

const listWithManyBlog = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    __v: 0
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    __v: 0
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    __v: 0
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    __v: 0
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    __v: 0
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    __v: 0
  }
]

const listWithOneBlog = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    __v: 0
  }
]

const blogNoURL =   {
  title: 'Go To Statement Considered Harmful',
  author: 'Edsger W. Dijkstra',
  __v: 0
}
const blogNoTitle =   {
  url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  author: 'Edsger W. Dijkstra',
  __v: 0
}

const createTester = async () => {
  await API
    .post('/api/users')
    .send({
      username: 'unique',
      name: 'Matti Lukkainen',
      password: 'salainen',
    })
}

const getToken = async () => {

  const token = await API
    .post('/api/login')
    .send({
      username: 'unique',
      password: 'salainen'
    })

  return token.body.userToken

}


module.exports = {
  listWithManyBlog,
  listWithOneBlog,
  blogNoURL,
  blogNoTitle,
  getToken,
  createTester
}