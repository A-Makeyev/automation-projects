import { Locator, Page, test } from "@playwright/test";

export class LoginPage {
    private readonly emailInput: Locator
    private readonly passwordInput: Locator
    private readonly continueButton: Locator
    public readonly errorText: Locator

    constructor(private readonly page: Page) {
        this.emailInput = this.page.locator('//input[@placeholder="you@email.com"]')
        this.passwordInput = this.page.locator('#password-input')
        this.continueButton = this.page.locator('//button[not(contains(@class, "Mui-disabled"))]//span[text()="Continue"]')
        this.errorText = this.page.locator('//p[contains(@class, "Mui-error")]')
    }

    otpInput(index: number): Locator {
        return this.page.locator(`(//input[@class="otp-input"])[${index}]`)
    }

    async goto() {
        await this.page.goto('/login')
    }

    async enterEmail(email: string) {
        await this.emailInput.fill(email)
    }

    async enterPassword(password: string) {
        await this.passwordInput.fill(password)
    }

    async pressContinue() {
        await this.continueButton.click()
    }

    async enterOTP(otp: string) {
        for (let x = 1; x <= otp.length; x++) {
            await this.otpInput(x).fill(String(otp[x - 1]))
        }
    }

    async takeScreenshot() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        const screenshotName = `screenshot-${timestamp}.png`
        const screenshotBuffer = await this.page.screenshot()
        
        await test.info().attach(screenshotName, {
            body: screenshotBuffer,
            contentType: 'image/png'
        });
    }
}