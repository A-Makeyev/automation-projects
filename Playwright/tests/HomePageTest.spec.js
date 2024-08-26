const {test, expect} = require('@playwright/test')

test('Home Page', async ({page}) => {
    await page.goto('https://demoblaze.com/index.html')  
    const pageTitle = await page.title()
    console.log('Title: ' + pageTitle)
    
    await expect(page).toHaveTitle('STORE')
    await expect(page).toHaveURL('https://demoblaze.com/index.html')
    page.close()
})
