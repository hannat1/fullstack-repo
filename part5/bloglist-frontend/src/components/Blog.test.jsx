import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders blog information, no buttons', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'John Doe',
    url: 'https://example.com',
    likes: 0,
    user: {
      username: 'testaaja2',
      name: 'Testikäyttäjä',
    },
  }

  render(<Blog blog={blog} loggedInUser={null} />)

  const title_and_author = screen.getByText(
    'John Doe: Component testing is done with react-testing-library',
  )

  const url = screen.queryByText('https://example.com')
  const likes = screen.queryByText('0 likes')

  const like_button = screen.queryByText('like')
  const delete_button = screen.queryByText('delete')

  expect(title_and_author).toBeDefined()
  expect(url).toBeDefined()
  expect(likes).toBeDefined()
  expect(like_button).toBeNull()
  expect(delete_button).toBeNull()
})

test('user is logged in, so like button is visible', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'John Doe',
    url: 'https://example.com',
    likes: 0,
    user: {
      username: 'testaaja2',
      name: 'Testikäyttäjä',
    },
  }

  render(
    <Blog
      blog={blog}
      loggedInUser={{ username: 'testaaja', name: 'Testikäyttäjä' }}
    />,
  )

  const title_and_author = screen.getByText(
    'John Doe: Component testing is done with react-testing-library',
  )

  const url = screen.getByText('https://example.com', { exact: false })
  const likes = screen.getByText('0 likes', { exact: false })

  const like_button = screen.queryByText('like')
  const delete_button = screen.queryByText('delete')

  expect(title_and_author).toBeDefined()
  expect(url).toBeDefined()
  expect(likes).toBeDefined()
  expect(like_button).toBeDefined()
  expect(delete_button).toBeNull()
})

test('user who made the blog can see the delete button', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'John Doe',
    url: 'https://example.com',
    likes: 0,
    user: {
      username: 'testaaja',
      name: 'Testikäyttäjä',
    },
  }

  render(
    <Blog
      blog={blog}
      loggedInUser={{ username: 'testaaja', name: 'Testikäyttäjä' }}
    />,
  )

  const title_and_author = screen.getByText(
    'John Doe: Component testing is done with react-testing-library',
  )

  const url = screen.getByText('https://example.com', { exact: false })
  const likes = screen.getByText('0 likes', { exact: false })

  const like_button = screen.queryByText('like')
  const delete_button = screen.queryByText('delete')

  expect(title_and_author).toBeDefined()
  expect(url).toBeDefined()
  expect(likes).toBeDefined()
  expect(like_button).toBeDefined()
  expect(delete_button).toBeDefined()
})

test('clicking the like button twice calls event handler twice', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'John Doe',
    url: 'https://example.com',
    likes: 0,
    user: {
      username: 'testaaja2',
      name: 'Testikäyttäjä',
    },
  }

  const mockHandler = vi.fn()

  render(
    <Blog
      blog={blog}
      likeBlog={mockHandler}
      loggedInUser={{ username: 'testaaja', name: 'Testikäyttäjä' }}
    />,
  )

  const user = userEvent.setup()

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
