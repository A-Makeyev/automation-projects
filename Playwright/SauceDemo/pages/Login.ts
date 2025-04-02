import { Page, expect } from '@playwright/test';

export class LoginPage {
    private readonly page: Page;
    private readonly baseUrl: string = 'https://www.saucedemo.com';

    constructor(page: Page, baseUrl?: string) {
        this.page = page;
        if (baseUrl) {
            this.baseUrl = baseUrl;
        }
    }

    async open(): Promise<void> {
        await this.page.goto(this.baseUrl);
    }

    async assertPageOpen(): Promise<void> {
        const loginBtn = this.page.locator('#login-button');
        await expect(loginBtn).toBeVisible();
    }

    async enterUsername(username: string): Promise<void> {
        const usernameField = this.page.locator('#user-name');
        await expect(usernameField).toBeVisible();
        await usernameField.click();
        await usernameField.fill(username);
    }

    async enterPassword(password: string): Promise<void> {
        const passwordField = this.page.locator('#password');
        await expect(passwordField).toBeVisible();
        await passwordField.click();
        await passwordField.fill(password);
    }

    async pressLoginButton(): Promise<void> {
        const loginBtn = this.page.locator('#login-button');
        await expect(loginBtn).toBeVisible();
        await loginBtn.click();
    }

    async assertLoginSuccess(): Promise<void> {
        const loginBtn = this.page.locator('#login-button');
        await expect(loginBtn).not.toBeVisible();
    }

    async assertLoginErrorMessage(expectedMessage: string): Promise<void> {
        const errorMessage = this.page.locator('[data-test="error"]');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toHaveText(expectedMessage);
    }
}
