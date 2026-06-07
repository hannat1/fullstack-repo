import {
  Card,
  CardContent,
  Typography,
  Button,
  Link,
  Stack,
} from '@mui/material'

const Blog = ({ dataTestid, blog, likeBlog, loggedInUser, handleRemove }) => {
  if (!blog) {
    return null
  }

  return (
    <Card
      data-testid={dataTestid}
      sx={{
        mb: 2,
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {blog.author}: {blog.title}
        </Typography>
        <Typography variant="h6" gutterBottom>
          <a href={blog.url}>{blog.url}</a>
          <br />
          {blog.likes} likes
          <br />
          added by {blog.user && blog.user.name ? blog.user.name : 'unknown'}
          <br />
        </Typography>

        {loggedInUser && (
          <Button
            color="success"
            variant="outlined"
            onClick={() => likeBlog(blog)}
          >
            like
          </Button>
        )}
        {loggedInUser?.username === blog.user?.username && (
          <Button
            color="error"
            variant="outlined"
            onClick={() => handleRemove(blog.id)}
          >
            delete
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default Blog
