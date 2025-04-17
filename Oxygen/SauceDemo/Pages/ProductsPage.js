const ProductsPage = {
    getAddToCartButtons: () => {
        return web.getElementCount('//button[text()="Add to cart"]')
    },

    getRemoveButtons: () => {
        return web.findElements('//button[text()="Remove"]')
    },

    getPriceBars: () => {
        return web.getElementCount('class=pricebar')
    },

    assertProductsCount: (expectedCount) => {
        const buttons = po.ProductsPage.getAddToCartButtons()

        if (buttons !== expectedCount) {
            assert.fail(`Expected ${expectedCount} products, found ${buttons.length}`)
        }

        log.info(`✔️  Verified product count: ${expectedCount}`)
    },

    assertPriceBarButtonText: (priceBarIndex, expectedText) => {
        const actualText = web.getText(`(//div[@class="pricebar"])[${priceBarIndex}]`)

        if (!actualText.includes(expectedText)) {
            assert.fail(`Expected button text '${expectedText}', got '${actualText}'`)
        }

        log.info(`✔️  Verified button text at index ${priceBarIndex}: ${expectedText}`)
    },

    clickAddToCartButton: (buttonIndex) => {
        web.click(`(//button[text()="Add to cart"])[${buttonIndex}]`)
    },

    clickRemoveButton: (buttonIndex) => {
        web.click(`(//button[text()="Remove"])[${buttonIndex}]`)
    },
}

module.exports = ProductsPage