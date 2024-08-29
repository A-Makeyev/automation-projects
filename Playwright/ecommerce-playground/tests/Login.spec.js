const { test, expect } = require('@playwright/test')

test('Login with wrong credentials', async ({ page }) => {
  await page.goto('https://ecommerce-playground.lambdatest.io')  

  const mainNavigation = await page.locator('#main-navigation')
  if (mainNavigation.isVisible()) {
    await page.hover('//div[@id="main-navigation"]//span[contains(text(), "My account")]')
    await page.click('//div[@id="main-navigation"]//span[contains(text(), "Login")]')
    await expect(page).toHaveURL('https://ecommerce-playground.lambdatest.io/index.php?route=account/login')
  } else {
    throw new Error('Main navigation bar is not visible')
  }

  const accountLogin = await page.locator('#account-login')
  if (accountLogin.isVisible()) {
    await page.fill('#input-email', 'anatoly.makeyev@cloudbeat.io')
    await page.fill('#input-password', 'Pa55w0rd')
    await page.click('//input[@value="Login"]')
  } else {
    throw new Error('Account login window is not visible')
  }

  const errorText = await page.locator('//div[@class="alert alert-danger alert-dismissible"]').textContent()
  await expect(errorText).toContain('No match for E-Mail Address and/or Password')
  console.log('Error text: ' + errorText)
})
