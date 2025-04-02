import { Page, expect, Locator } from '@playwright/test';


export class ProductsPage {
    private page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }

    getAddToCartButtons(): Locator {
        return this.page.locator("button:text('Add to cart')");
    }

    getRemoveButtons(): Locator {
        return this.page.locator("button:text('Remove')");
    }

    getPriceBars(): Locator {
        return this.page.locator(".pricebar");
    }

    async assertProductsCount(expectedCount: number) {
        const count = await this.getAddToCartButtons().count();
        expect(count).toBe(expectedCount);
    }

    async assertPriceBarButtonText(priceBarIndex: number, expectedText: string) {
        const button = this.getPriceBars().nth(priceBarIndex).locator("button");
        await expect(button).toHaveText(expectedText);
    }

    async clickAddToCartButton(buttonIndex: number) {
        await this.getAddToCartButtons().nth(buttonIndex).click();
    }

    async clickRemoveButton(buttonIndex: number) {
        await this.getRemoveButtons().nth(buttonIndex).click();
    }
}