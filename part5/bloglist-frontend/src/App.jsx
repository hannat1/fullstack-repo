import { useState, useEffect } from 'react'
import { Routes, Route, Link, useMatch } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { Container, AppBar, Toolbar, Button, Typography } from '@mui/material'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState(null)

  const navigate = useNavigate()
  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  console.log(user)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = async (blogObject) => {
    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat({ ...returnedBlog, user: user }))

    setNotification({
      text: `Blog '${returnedBlog.title}' created succesfully!`,
      type: 'success',
    })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const deleteBlog = async (id) => {
    if (window.confirm('Are you sure you want to remove this blog?')) {
      await blogService.remove(id)
      setBlogs(blogs.filter((blog) => blog.id !== id))
      navigate('/')
      setNotification({
        text: 'A blog was succesfully removed',
        type: 'success',
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const likeBlog = async (blogObject) => {
    const updatedBlog = { ...blogObject, likes: blogObject.likes + 1 }
    const returnedBlog = await blogService.update(blogObject.id, updatedBlog)
    setBlogs(
      blogs.map((blog) =>
        blog.id === blogObject.id
          ? { ...returnedBlog, user: blogObject.user }
          : blog,
      ),
    )
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      navigate('/')
      setNotification({
        text: `${user.username} has been logged in`,
        type: 'success',
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch {
      setNotification({
        text: 'wrong credentials',
        type: 'error',
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()

    try {
      window.localStorage.removeItem('loggedBloglistUser')
      setUser(null)
      navigate('/')
      setNotification({
        text: 'You have been logged out',
        type: 'success',
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch {
      setNotification({
        text: 'logout failed',
        type: 'error',
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const match = useMatch('/blogs/:id')

  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null
  const hoverStyle = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/" sx={hoverStyle}>
            blogs
          </Button>

          <Button color="inherit" component={Link} to="/create" sx={hoverStyle}>
            new blog
          </Button>

          {!user ? (
            <Button
              color="inherit"
              component={Link}
              to="/login"
              sx={hoverStyle}
            >
              login
            </Button>
          ) : (
            <Button color="inherit" onClick={handleLogout} sx={hoverStyle}>
              logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Notification notification={notification} />
      <Typography variant="h4" gutterBottom>
        Blogs
      </Typography>

      <Routes>
        <Route
          path="/login"
          element={
            <LoginForm
              handleLogin={handleLogin}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              username={username}
              password={password}
            />
          }
        />
        <Route path="/create" element={<BlogForm createBlog={addBlog} />} />
        <Route
          path="/"
          element={<BlogList blogs={blogs} setErrorMessage={setNotification} />}
        />
        <Route
          path="/blogs/:id"
          element={
            <Blog
              blog={blog}
              likeBlog={likeBlog}
              handleRemove={deleteBlog}
              loggedInUser={user}
            />
          }
        />
      </Routes>
    </div>
  )
}

export default App
