const listHelper = require('../utils/list_helper')
const helper = require('./tests_helper')





describe('total likes', () => {

  test('of a list with 1 blog is that blog\'s likes', () => {
    expect(listHelper.totalLikes(helper.listWithOneBlog)).toBe(helper.listWithOneBlog[0].likes)
  })

  test('of a list with zero blogs should be 0', () => {
    expect(listHelper.totalLikes([])).toBe(0)
  })

  test('of a bigger list is calculated correctly', () => {
    expect(listHelper.totalLikes(helper.listWithManyBlog)).toBe(36)
  }) //23

})

describe('favourite blog', () => {

  test('of a list with 1 blog is that blog', () => {
    expect(listHelper.favouriteBlog(helper.listWithOneBlog)).toBe(helper.listWithOneBlog[0])
  })

  test('of a list with zero blogs should be none', () => {
    expect(listHelper.favouriteBlog([])).toEqual({})
  })

  test('of a bigger list is calculated correctly', () => {
    expect(listHelper.favouriteBlog(helper.listWithManyBlog)).toBe(helper.listWithManyBlog[2])
  })

})

describe('author the most', () => {
  test('prolific', () => {
    expect(listHelper.mostBlogs(helper.listWithManyBlog)[0]).toBe('Robert C. Martin')
  })

  test('beloved', () => {
    expect(listHelper.mostLikes(helper.listWithManyBlog)[0]).toBe('Edsger W. Dijkstra')
  })
})



