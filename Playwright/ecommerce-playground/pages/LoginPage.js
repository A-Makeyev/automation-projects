const { expect } = require("@playwright/test")

module.exports = class RegisterPage {
    constructor(page, baseURL) {
        this.page = page
        this.baseURL = baseURL
        this.email = process.env.EMAIL
        this.password = process.env.PASSWORD
        this.accountHeaders = ['My Account', 'My Orders', 'My Affiliate Account']

        /* locators */

        this.emailInput = '#input-email'
        this.passwordInput = '#input-password'
        this.loginButton = '//input[@value="Login"]'
        this.errorText = '//div[contains(@class, "alert-danger")]'
        this.accountWindow = '#account-account'
        this.accountHeaders = '//div[@id="account-account"]//*[contains(@class, "card-header")]'
    }

    async openLoginForm() {
        await this.page.goto('/index.php?route=account/login')
        await expect(this.page).toHaveTitle('Account Login')
    }

    async login(wrongCredentials) {
        let email = !wrongCredentials ? this.email : 'some@email.com'  
        let password = !wrongCredentials ? this.password : 'Pa55w0rD'  

        await this.openLoginForm()
        await this.page.fill(this.emailInput, email)
        await this.page.fill(this.passwordInput, password)
        await this.page.click(this.loginButton)

        if (await this.page.locator(this.errorText, { timeout: 5000 })) {
            let error = await this.page.locator(this.errorText).textContent()
            if (error.includes('exceeded allowed number of login attempts')) {
                throw new Error(error)
            }
        }
    }

    async assertValidLogin() {
        let window = await this.page.locator(this.accountWindow)
        await expect(window).toBeVisible()
        await expect(this.page).toHaveTitle('My Account')

        let headers = await page.locator(this.accountHeaders).all()
        await expect(headers).toHaveLength(3)
    
        console.log('Headers:')
        for (let header = 1; header < headers.length; header++) {
            let title = await page.locator(`(${this.accountHeaders})[${product}]`).textContent()
            console.log(`${header}. ${title}`)
        }        
    }

    async assertErrorMessage() {
        let error = await this.page.locator(this.errorText).textContent()
        await expect(error).toContain('Warning')
        await expect(error).toHaveCSS('color', '#721c24')
        console.log('Register Error: ' + error)
    }

}