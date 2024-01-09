web.transaction('01. Init')
web.init()

const customerNumber = '666666'
const customerPassword = 'XXXX'
const customerEmail = 'XXXXX@yahoo.com'

web.transaction('02. Open Login Page')
web.open('https://operation.ship.co.il/#/login')

web.transaction('03. Type Login Details')
web.type('//input[@type="number"]', customerNumber)
web.type('//input[@type="email"]', customerEmail)
web.type('//input[@type="password"]', customerPassword)

web.transaction('04. Login')
web.click('//button[contains(text(), "התחבר")]')

web.transaction('05. Open Delivery Details')
web.click(`//span[contains(text(), 'משלוחים פ"א')]`)

web.transaction('06. Accept Pop Up Message')
if (web.isVisible('//span[text()="חוזה שטר המטען"]', 2500)) {
    web.click('//span[text()="חוזה שטר המטען"]//..//..//span[@class="mdl-checkbox__ripple-container mdl-ripple--center"]')
    web.click('//span[text()="חוזה שטר המטען"]//..//..//button[contains(text(), "אישור")]')
}

web.transaction('07. Type Details')
web.type('//h3[contains(text(), "פרטי נמען")]//..//input[@formcontrolname="recipientName"]', 'א')
web.waitForVisible('(//div[@role="listbox"]//mat-option)[1]')
web.click('(//div[@role="listbox"]//mat-option)[1]')

web.transaction('08. Save and Print')
web.waitForExist('//button[contains(text(), "צור והדפס") and not(@disabled="disabled")]')
web.click('//button[contains(text(), "צור והדפס") and not(@disabled="disabled")]')

web.transaction('09. Extract Delivery Number')
web.waitForVisible('//div[@role="alertdialog"]')

var deliveryNumber = web.getText('//div[@role="alertdialog"]')
deliveryNumber = deliveryNumber.replace(/[^a-z0-9]/gi, '')

log.info(`Delivery Number: ${deliveryNumber}`) 

assert.equal(web.isVisible('//div[@role="alertdialog" and contains(text(), "נוצר בהצלחה")]'), true)
web.waitForVisible('//span[contains(text(), "פורמט הדפסה מדבקת")]')

web.transaction('10. Download Document')
web.click('//button//i[text()="file_download"]')
web.pause(2500)

web.transaction('11. Assert Document Delivery Number')
var filePath = `C:\\Users\\Makeyev\\Downloads\\WB_${deliveryNumber}.pdf`
var deleteFile = true

pdf.assert(
    filePath,
    deliveryNumber,
    1, // Number of Pages
    `${deliveryNumber} was not found in the document`
)

if (deleteFile) {
    web.pause(2500)
    web.transaction('12. Delete Document')
    try {
        let fs = require('fs')
        fs.unlinkSync(filePath)
    } catch(err) {
        console.error(err)
    }
}
