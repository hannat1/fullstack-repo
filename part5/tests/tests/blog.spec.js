const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')
const strict = require('node:assert/strict')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen',
      },
    })
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Toinen Luukkainen',
        username: 'toinen',
        password: 'salainen',
      },
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await page.goto('http://localhost:5173/login')

    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')

      await expect(page.getByText('logout')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'väärä', 'salainen')
      const errorDiv = page.locator('.error')

      await expect(errorDiv).toBeVisible()
      await expect(errorDiv).toContainText('wrong credentials')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('wrong credentials')).toBeVisible()
      await expect(page.getByText('logout')).not.toBeVisible()
    })
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      console.log(
        await page.evaluate(() => localStorage.getItem('loggedBlogappUser')),
      )
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(
        page,
        'a blog created by playwright',
        'Test',
        'http://example.com',
      )
      await expect(page.getByText(/created succesfully/i)).toBeVisible()
      await expect(
        page.getByRole('link', { name: 'a blog created by playwright' }),
      ).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(
        page,
        'a blog created by playwright',
        'Test',
        'http://example.com',
      )

      await page
        .getByRole('link', { name: 'a blog created by playwright' })
        .click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('1 likes')).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('2 likes')).toBeVisible()
    })

    test('a blog can be removed by user who made it', async ({ page }) => {
      await createBlog(
        page,
        'This blog will be deleted',
        'Test',
        'http://example.com',
      )
      await page
        .getByRole('link', { name: 'This blog will be deleted' })
        .click()
      page.on('dialog', async (dialog) => {
        await dialog.accept()
      })
      await page.getByRole('button', { name: 'delete' }).click()

      await expect(
        page.getByText('Test: This blog will be deleted'),
      ).not.toBeVisible()
    })

    test('a blog cannot be removed by other users', async ({
      page,
      request,
    }) => {
      await createBlog(
        page,
        'This blog cannot be deleted by other users',
        'Test',
        'http://example.com',
      )

      await page.getByRole('button', { name: 'logout' }).click()

      await loginWith(page, 'toinen', 'salainen')

      await page
        .getByRole('link', {
          name: 'This blog cannot be deleted by other users',
        })
        .click()
      await expect(
        page.getByRole('button', { name: 'delete' }),
      ).not.toBeVisible()

      await expect(
        page.getByText('Test: This blog cannot be deleted by other users'),
      ).toBeVisible()

      await createBlog(
        page,
        'This blog will be deleted',
        'Test',
        'http://example.com',
      )
      await page
        .getByRole('link', { name: 'This blog will be deleted' })
        .click()
      page.on('dialog', async (dialog) => {
        await dialog.accept()
      })

      await page.getByRole('button', { name: 'delete' }).click()
      await expect(
        page.getByRole('link', { name: 'This blog will be deleted' }),
      ).not.toBeVisible()
    })
  })

  describe('blogs are ordered according to likes', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await createBlog(page, 'blog 1', 'Test', 'http://example.com')
      await page.pause()
      await createBlog(page, 'blog 2', 'Test', 'http://example.com')

      const firstBlog = page.getByTestId('blog').filter({ hasText: 'blog 1' })
      const secondBlog = page.getByTestId('blog').filter({ hasText: 'blog 2' })

      await firstBlog.getByText('blog 1').click()
      await firstBlog.getByRole('button', { name: 'like' }).click()
      await expect(firstBlog).toContainText('1 likes')

      await firstBlog.getByRole('button', { name: 'like' }).click()
      await expect(firstBlog).toContainText('2 likes')

      await secondBlog.getByText('blog 2').click()
      await secondBlog.getByRole('button', { name: 'like' }).click()
      await expect(secondBlog).toContainText('1 likes')
    })

    test('blogs are ordered according to likes with the blog with most likes being first', async ({
      page,
    }) => {
      const blogs = page.getByTestId('blog')
      await expect(blogs.nth(0)).toContainText('blog 1')
      await expect(blogs.nth(1)).toContainText('blog 2')
    })

    test('blog order is updated when a blog is liked and it passes another blog', async ({
      page,
    }) => {
      const firstBlog = page.getByTestId('blog').filter({ hasText: 'blog 1' })
      const secondBlog = page.getByTestId('blog').filter({ hasText: 'blog 2' })

      await secondBlog.getByRole('button', { name: 'like' }).click()
      await expect(secondBlog).toContainText('2 likes')
      await secondBlog.getByRole('button', { name: 'like' }).click()
      await expect(secondBlog).toContainText('3 likes')

      const blogs = page.getByTestId('blog')
      await expect(blogs.nth(1)).toContainText('blog 1')
      await expect(blogs.nth(0)).toContainText('blog 2')

      await firstBlog.getByRole('button', { name: 'like' }).click()
      await expect(firstBlog).toContainText('3 likes')
      await firstBlog.getByRole('button', { name: 'like' }).click()
      await expect(firstBlog).toContainText('4 likes')

      const blogs2 = page.getByTestId('blog')
      await expect(blogs2.nth(0)).toContainText('blog 1')
      await expect(blogs2.nth(1)).toContainText('blog 2')
    })
  })
})
