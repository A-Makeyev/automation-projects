const { test, expect } = require('@playwright/test')
const RegisterPage =  require('../pages/RegisterPage')

test('Register', async ({ page, baseURL }) => {
    const registerPage = new RegisterPage(page, baseURL)
    await registerPage.openRegisterForm()
    await registerPage.enterDetails(true)  
    await registerPage.submitForm()
    await registerPage.assertErrorMessage()
})
