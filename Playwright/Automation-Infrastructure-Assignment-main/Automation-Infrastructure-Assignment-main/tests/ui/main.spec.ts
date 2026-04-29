import { expect, test } from "../fixtures"

test.describe('Main page tests', () => {
  
  test.beforeEach(async ({ mainPage }) => {
    await mainPage.goto()
  })

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await testInfo.attach('screenshot-on-failure', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      })
    }
  })

  test('TASK 1: Verify UI and API debugging features match', async ({ mainPage, servicePage }) => {
    const features = await mainPage.getDebuggingFeaturesList()
    const normalizedFeatures = await mainPage.normalizeDebuggingFeaturesList(features)
    
    const wordCountFromUI = await mainPage.countWords(normalizedFeatures)
    const data = await servicePage.getDebuggingFeaturesList()
    const wordCountFromAPI = await servicePage.countWords(data)

    expect(normalizedFeatures).toBe(data)
    expect(wordCountFromUI).toBe(wordCountFromAPI)
  })

  test('TASK 2: Assert that microsoft tools links are valid', async ({ mainPage }) => {
    await mainPage.openMicrosoftTools()
    await mainPage.validateAllTechnologyNamesAreLinks()
  })

  test('TASK 3: Assert background color is changing to dark mode', async ({ mainPage, page }) => {
      // await mainPage.assertSnapshot('light-mode')
      await mainPage.assertThemeColors('day')
      await expect(mainPage.backgroundColor('day')).toBeVisible()

      await mainPage.changeBackgroundColorToDark()
      await page.waitForTimeout(1000)

      // await mainPage.assertSnapshot('dark-mode')
      await mainPage.assertThemeColors('night')
      await expect(mainPage.backgroundColor('night')).toBeVisible()
  })
})
