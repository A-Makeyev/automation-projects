import { test as base } from "@playwright/test";
import { LoginService } from "../../services/LoginService";
import { LoginPage } from "../../pages/LoginPage";

export const test = base.extend<{
    loginService: LoginService,
    loginPage: LoginPage
}>({
    loginService: async ({ request }, use) => {
        await use(new LoginService(request))
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page))
    }
})

export { expect } from "@playwright/test"