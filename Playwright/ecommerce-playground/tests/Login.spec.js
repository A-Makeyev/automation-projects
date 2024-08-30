const { test, expect } = require('@playwright/test')
const LoginPage = require('../pages/LoginPage')

test('Login', async ({ page, baseURL }) => {
  const loginPage = new LoginPage(page, baseURL)
  await loginPage.login(true)
  await loginPage.assertValidLogin()
})

test('Login with wrong credentials', async ({ page, baseURL }) => {
  const loginPage = new LoginPage(page, baseURL)
  await loginPage.login(false)
  await loginPage.assertErrorMessage()
})
