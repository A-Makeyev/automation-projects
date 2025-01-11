const { expect } = require("@playwright/test")

module.exports = class RegisterPage {
    constructor(page, baseURL) {
        this.page = page
        this.baseURL = baseURL
        this.firstName = 'Anatoly'
        this.lastName = 'Makeyev'
        this.phone = '+972527729974'
        this.email = process.env.EMAIL
        this.password = process.env.PASSWORD

        /* locators */
        
        this.firstNameInput = '#input-firstname'
        this.lastNameInput = '#input-lastname'
        this.emailInput = '#input-email'
        this.phoneInput = '#input-telephone'
        this.passwordInput = '#input-password'
        this.confirmPasswordInput = '#input-confirm'
        this.subscribeYesRadio = '//input[@id="input-newsletter-yes"]//..//label'
        this.subscribeNoRadio = '//input[@id="input-newsletter-no"]//..//label'
        this.policyAgreeCheckbox = '//input[@id="input-agree"]//..//..//div'
        this.continuteButton = '//input[@value="Continue"]'
        this.errorText = '//div[contains(@class, "alert-danger")]'
    }

    async openRegisterForm() {
        await this.page.goto('/index.php?route=account/register')
        await expect(this.page).toHaveTitle('Register Account')
    }

    async enterDetails(subscribe) {
        await this.page.fill(this.firstNameInput, this.firstName)
        await this.page.fill(this.lastNameInput, this.lastName)
        await this.page.fill(this.emailInput, this.email)
        await this.page.fill(this.phoneInput, this.phone)
        await this.page.fill(this.passwordInput, this.password)
        await this.page.fill(this.confirmPasswordInput, this.password)
        
        await expect.soft(this.page.locator(this.subscribeNoRadio)).toBeChecked()

        if (subscribe) {
            await this.page.click(this.subscribeYesRadio)
        } else {
            await this.page.click(this.subscribeNoRadio)
        }
        
        await this.page.click(this.policyAgreeCheckbox)
    }

    async submitForm() {
        await this.page.click(this.continuteButton)
    }

    async assertErrorMessage() {
        let error = await this.page.locator(this.errorText).textContent()
        await expect(error).toContain('E-Mail Address is already registered')
        console.log('Register Error: ' + error)
    }

}