const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

test('blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    const blogs = response.body

    expect(blogs.length).toBe(9)
})

test('blogs ids are defined as id', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogs = response.body

    blogs.forEach(blog => {
        expect(blog.id).toBeDefined()
    })
})

test('a valid blog can be added', async () => {

    const initialBlogs = await Blog.find({})

    const newBlog = {
        title: 'Testing Test',
        author: 'Testy Test',
        url: 'test.com',
        likes: 69
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const result = await Blog.find({})

    expect(result).toHaveLength(initialBlogs.length + 1)
})

test('if likes are undefined, 0 is put', async () => {

    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogs = response.body

    blogs.forEach(blog => {
        expect(typeof blog.likes).toBeGreaterThanOrEqual(0)
    })
})

test('title and url are required', async () => {

    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogs = response.body

    blogs.forEach(blog => {
        expect(blog.title).toBeDefined()
        expect(blog.url).toBeDefined()
    })

})

test('remove a blog by id', async () => {

  const initialBlogs = await Blog.find({})
  const blogToDelete = initialBlogs[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)
  
  const result = await Blog.find({})

  expect(result).toHaveLength(initialBlogs.length - 1)

  const ids = result.map(r => r.id)

  expect(ids).not.toContain(blogToDelete.id)
})

test('change info for a blog', async () => {

  const updatedData = {
    title: 'Updated Title',
    author: 'Updated Author',
    url: 'http://updated.com',
    likes: 100,
  }

  const initialBlogs = await Blog.find({})
  const blogToUpdate = initialBlogs[0]

  const result = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedData)

  expect(result.body).toMatchObject(updatedData)
  
})

afterAll(async() => {
    await mongoose.connection.close()
})