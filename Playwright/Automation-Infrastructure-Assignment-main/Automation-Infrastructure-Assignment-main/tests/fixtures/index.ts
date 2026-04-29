import { test as base } from "@playwright/test";
import { MainMainPlaywrightPage } from "../../pages/MainPlaywrightPage";
import { MainPlaywrightService } from "../../services/MainPlaywrightService";

export const test = base.extend<{
    mainPage: MainMainPlaywrightPage,
    servicePage: MainPlaywrightService
}>({
    mainPage: async ({ page }, use) => {
        await use(new MainMainPlaywrightPage(page))
    },
    servicePage: async ({ request }, use) => {
        await use(new MainPlaywrightService(request))
    }
})

export { expect } from "@playwright/test"