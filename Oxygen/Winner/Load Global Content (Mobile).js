mob.transaction('01. Initialize')
mob.init()

mob.transaction('02. Open Main Page')
mob.open('https://m.winner.co.il/')
mob.waitForExist('//div[@id="page_current"]')

if (mob.isVisible('//img[contains(@id, "CLOSE")]', 9000)) {
    mob.click('//img[contains(@id, "CLOSE")]')
}

mob.transaction('03. Load Global Winner Data')
mob.select('//select[@id="submenu"]', 'label=עולמי Winner')
mob.waitForExist('//ul[@class="games"]')
