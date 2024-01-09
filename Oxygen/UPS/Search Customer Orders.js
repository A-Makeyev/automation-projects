web.transaction('01. Init')
web.init({
    browserName: 'chrome',
    'goog:chromeOptions': {
        args: [
            '--no-sandbox',
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--ignore-certificate-errors',
            'disable-infobars',
        ],
    }
})

const customerNumber = '66666666'
const customerPassword = '666666'
const customerEmail = 'XXXXX@gmail.com'

web.transaction('02. Open Main Page')
web.open('https://operation.ship.co.il/#/easyship/find-customer')

web.waitForExist('//img[@alt="easy ship logo"]')
assert.equal(web.isVisible('//img[@alt="easy ship logo"]'), true)

web.transaction('03. Open Sign In Window')
web.click('//div[contains(text(), "התחברות עם סיסמה")]')

web.transaction('04. Type Details')
web.type('//input[@formcontrolname="vatIdNumber"]', customerNumber)
web.type('//input[@formcontrolname="username"]', customerEmail)
web.type('//input[@formcontrolname="password"]', customerPassword)

web.transaction('05. Sign In')
web.click('//button//span[text()="קדימה"]')

web.transaction('06. Assert Delivery Data Tables')
assert.equal(web.isVisible('//span[contains(text(), "משלוחים בארץ - להזמנה")]'), true)
assert.equal(web.isVisible(`//span[contains(text(), 'משלוחים לחו"ל - להזמנה')]`), true)
assert.equal(web.isVisible('//span[contains(text(), "המשלוחים שלי")]'), true)

var dataTables = '//div[contains(@class, "ema-group-container list-container ng-star-inserted")]'
var dataTableCount = web.getElementCount(dataTables)

for (let x = 1; x <= dataTableCount; x++) {
    web.waitForVisible(`(${dataTables})[${x}]`)
    log.info(`Table ${x}: (${dataTables})[${x}]`)

    var dataRows = `(${dataTables})[${x}]//div[@fxlayout="row"]`
    var dataRowsCount = web.getElementCount(dataRows)

    for (let y = 1; y <= dataRowsCount; y++) {
        web.waitForVisible(`(${dataRows})[${y}]`)
        log.info(`Row ${y}: (${dataRows})[${y}]`)
    }
}
