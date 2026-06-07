const { test, describe, expect, beforeEach } = require('@playwright/test')

const loginWith = async (page, username, password) => {
  await page.goto('http://localhost:5173/login')

  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
  await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
}

const createBlog = async (page, title, author, url) => {
  await page.goto('http://localhost:5173/create')

  await page.getByPlaceholder('title').fill(title)
  await page.getByPlaceholder('author').fill(author)
  await page.getByPlaceholder('url').fill(url)
  page.on('response', async (response) => {
    if (response.url().includes('/api/blogs')) {
      console.log(response.status(), response.url())
    }
  })
  await page.getByRole('button', { name: 'create' }).click()
  await expect(page.getByRole('link', { name: title })).toBeVisible()
}

export { loginWith, createBlog }
