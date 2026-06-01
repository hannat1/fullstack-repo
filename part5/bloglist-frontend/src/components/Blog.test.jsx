import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title and author', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'John Doe',
    url: 'https://example.com',
    likes: 0,
  }

  render(<Blog blog={blog} />)

  const title_and_author = screen.getByText(
    'Component testing is done with react-testing-library John Doe',
  )

  const url = screen.queryByText('https://example.com')
  const likes = screen.queryByText('0 likes')

  expect(title_and_author).toBeDefined()
  expect(url).toBeNull()
  expect(likes).toBeNull()
})

test('clicking the view button makes url and likes visible', async () => {
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

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const title_and_author = screen.getByText(
    'Component testing is done with react-testing-library John Doe',
  )

  const url = screen.getByText('https://example.com', { exact: false })
  const likes = screen.getByText('0 likes', { exact: false })

  expect(title_and_author).toBeDefined()
  expect(url).toBeDefined()
  expect(likes).toBeDefined()
})

test('clicking the like button twice calls event handler twice', async () => {
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

  const mockHandler = vi.fn()

  render(
    <Blog
      blog={blog}
      likeBlog={mockHandler}
      loggedInUser={{ username: 'testaaja', name: 'Testikäyttäjä' }}
    />,
  )

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
