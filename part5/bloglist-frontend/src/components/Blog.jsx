import { useState } from 'react'

const Blog = ({ dataTestid, blog, likeBlog, loggedInUser, handleRemove }) => {
  const [view, setView] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div style={blogStyle} data-testid={dataTestid}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setView(!view)}>{view ? 'hide' : 'view'}</button>
      </div>

      {view && (
        <div>
          {blog.url} <br />
          {blog.likes} likes{' '}
          <button onClick={() => likeBlog(blog)}>like</button> <br />
          {console.log(blog.user)}
          {blog.user && console.log(blog.user.name)}
          {blog.user.name && <div> {blog.user.name}</div>}
          {!blog.user.name && <div> {blog.user.username}</div>}
          {loggedInUser.username === blog.user.username && (
            <button onClick={() => handleRemove(blog)}>delete</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
