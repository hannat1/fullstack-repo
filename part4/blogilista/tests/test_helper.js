const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'John Doe',
    url: 'https://example.com/html',
    likes: 0,
  },
  {
    title: 'Browser can execute only JavaScript',
    author: 'Jane Smith',
    url: 'https://example.com/javascript',
    likes: 5,
  },
]
const nonExistingId = async () => {
  const blog = new Blog({
    title: 'willremovethissoon',
    author: 'John Doe',
    url: 'https://example.com',
    likes: 0,
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
}
