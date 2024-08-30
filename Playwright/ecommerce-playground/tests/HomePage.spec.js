const {test, expect} = require('@playwright/test')

test('Assert home page', async ({ page, baseURL }) => {
    await page.goto(baseURL)  
    const pageTitle = await page.title()
    console.log('Title: ' + pageTitle)
    
    await expect(page).toHaveTitle('Your Store')

    const home = await page.locator('#common-home')
    await expect(home).toBeVisible()
    page.close()
})

test('Get products', async ({ page, baseURL }) => {
    await page.goto(baseURL)

    const productsXpath = '//div[@class="product-thumb image-top"]'
    const products = await page.locator(productsXpath).all()
    await expect.soft(products).toHaveLength(84)

    if (products.length < 1) {
        console.log('No products were found')
    } else {
        console.log(`Found ${products.length} ${products.length === 1 ? 'product' : 'products'}:`)
        console.log('*'.repeat(50))
        for (let product = 1; product < products.length; product++) {
            let title = await page.locator(`(${productsXpath}//h4[@class="title"])[${product}]`).textContent()
            let price = await page.locator(`(${productsXpath}//div[@class="price"])[${product}]`).textContent()
            console.log(`${product}. ${title} -> ${price}`)
        }
        console.log('*'.repeat(50))
    }
})
