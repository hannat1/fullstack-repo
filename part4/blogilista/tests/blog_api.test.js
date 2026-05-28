const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

describe('when there are initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map((e) => e.title)
    assert(titles.includes('HTML is easy'))
  })

  test('the identifier is id', async () => {
    const response = await api.get('/api/blogs')

    const blog = response.body[0]
    console.log(blog)
    assert('id' in blog)
  })

  describe('adding a new blog', () => {
    test('a valid blog can be added', async () => {
      const newBlog = {
        title: 'New Blog',
        author: 'John Doe',
        url: 'https://example.com',
        likes: 0,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/blogs')
      assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
      const titles = response.body.map((b) => b.title)
      assert(titles.includes('New Blog'))
    })

    test('a blog with no reported likes can be added and defaults to zero', async () => {
      const newBlog = {
        title: 'No likes',
        author: 'John Doe',
        url: 'https://example.com',
      }

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      console.log(response.body)
      assert.strictEqual(response.body.likes, 0)
    })

    test('a blog with no title or url cannot be added', async () => {
      const newBlog = {
        author: 'No title',
        url: 'https://example.com',
      }
      await api.post('/api/blogs').send(newBlog).expect(400)

      const newBlog2 = {
        title: 'No URL',
        author: 'John Doe',
      }
      await api.post('/api/blogs').send(newBlog2).expect(400)

      const newBlog3 = {
        author: 'No title and URL',
      }
      await api.post('/api/blogs').send(newBlog3).expect(400)
    })
  })

  describe('deleting a blog', () => {
    test('a blog can be deleted', async () => {
      const blogsAtStart = await api.get('/api/blogs')
      const blogToDelete = blogsAtStart.body[0]

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

      const blogsAtEnd = await api.get('/api/blogs')
      assert.strictEqual(blogsAtEnd.body.length, helper.initialBlogs.length - 1)

      const titles = blogsAtEnd.body.map((b) => b.title)
      assert(!titles.includes(blogToDelete.title))
    })
  })

  describe('updating a blog', () => {
    test('a blog can be updated', async () => {
      const blogsAtStart = await api.get('/api/blogs')
      const blogToUpdate = blogsAtStart.body[0]

      const updatedBlog = {
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: 8,
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)

      const blogsAtEnd = await api.get('/api/blogs')
      const updatedBlogInList = blogsAtEnd.body.find(
        (b) => b.id === blogToUpdate.id,
      )
      assert.strictEqual(updatedBlogInList.likes, 8)
    })
  })

  after(async () => {
    await mongoose.connection.close()
  })
})
