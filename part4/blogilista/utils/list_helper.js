const _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  return blogs.reduce((prev, current) =>
    prev.likes > current.likes ? prev : current,
  )
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const blogCounts = _.countBy(blogs, 'author')
  const mostBlogsAuthor = _.maxBy(
    Object.keys(blogCounts),
    (author) => blogCounts[author],
  )
  return { author: mostBlogsAuthor, blogs: blogCounts[mostBlogsAuthor] }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const byAuthors = _.groupBy(blogs, 'author')
  const likesPerAuthor = _.map(byAuthors, (blogs, author) => ({
    author,
    likes: _.sumBy(blogs, 'likes'),
  }))
  return _.maxBy(likesPerAuthor, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
