const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const bcrypt = require('bcrypt')
const User = require('../models/user')

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
    let token
    beforeEach(async () => {
      await User.deleteMany({})
      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'testuser', passwordHash })
      await user.save()
      const result = await api
        .post('/api/login')
        .send({ username: 'testuser', password: 'sekret' })

      token = `Bearer ${result.body.token}`
    })

    test('a valid blog can be added', async () => {
      const newBlog = {
        title: 'New Blog',
        author: 'John Doe',
        url: 'https://example.com',
        likes: 0,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', token)
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
        .set('Authorization', token)
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
      await api
        .post('/api/blogs')
        .set('Authorization', token)
        .send(newBlog)
        .expect(400)

      const newBlog2 = {
        title: 'No URL',
        author: 'John Doe',
      }
      await api
        .post('/api/blogs')
        .set('Authorization', token)
        .send(newBlog2)
        .expect(400)

      const newBlog3 = {
        author: 'No title and URL',
      }
      await api
        .post('/api/blogs')
        .set('Authorization', token)
        .send(newBlog3)
        .expect(400)
    })
  })

  describe('deleting a blog', () => {
    let token
    let id
    beforeEach(async () => {
      await User.deleteMany({})
      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'testuser', passwordHash })
      await user.save()
      const result = await api
        .post('/api/login')
        .send({ username: 'testuser', password: 'sekret' })

      token = `Bearer ${result.body.token}`

      const deleteBlog = {
        title: 'Delete Me',
        author: 'John Doe',
        url: 'https://example.com',
        likes: 0,
      }

      const blogToBeDeleted = await api
        .post('/api/blogs')
        .set('Authorization', token)
        .send(deleteBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      id = blogToBeDeleted.body.id
    })

    test('a blog can be deleted', async () => {
      const blogsAtStart = await api.get('/api/blogs')

      await api
        .delete(`/api/blogs/${id}`)
        .set('Authorization', token)
        .expect(204)

      const blogsAtEnd = await api.get('/api/blogs')
      assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length - 1)

      const titles = blogsAtEnd.body.map((b) => b.title)
      assert(!titles.includes('Delete Me'))
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
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  describe('creating a user', () => {
    test('creation succeeds with a fresh and valid username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

      const usernames = usersAtEnd.map((u) => u.username)
      assert(usernames.includes(newUser.username))
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('expected `username` to be unique'))

      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if username or password is too short', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser1 = {
        username: 'ro',
        name: 'Short Username',
        password: 'salainen',
      }

      const result1 = await api
        .post('/api/users')
        .send(newUser1)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert(
        result1.body.error.includes(
          'username and password are required and must be at least 3 characters long',
        ),
      )

      const newUser2 = {
        username: 'validusername',
        name: 'Short Password',
        password: 'sa',
      }

      const result2 = await api
        .post('/api/users')
        .send(newUser2)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert(
        result2.body.error.includes(
          'username and password are required and must be at least 3 characters long',
        ),
      )

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
  })

  after(async () => {
    await mongoose.connection.close()
  })
})
