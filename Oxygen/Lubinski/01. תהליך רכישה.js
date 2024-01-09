const id = '999099999'
const phone = '0555555555'
const carModel = '2008 SUV'
const email = 'XXX@XXX.COM'
const firstName = 'אוטומציה'
const lastName = 'מכירה'

function sign(canvasElement) {
    var canvas = web.findElement(canvasElement)
    for (let x = 0; x < 10; x++) web.click(canvas)

    web.execute((c) => {
        var ev = document.createEvent('MouseEvents')
        ev.initEvent('mousedown', true, true)
        c.dispatchEvent(ev)

        var random = (min, max) => {
            return Math.floor(Math.random() * (max - min + 1)) + min
        }

        var ctx = c.getContext('2d')
        for (let x = 0; x < random(10, 30); x++) 
            ctx.lineTo(random(100, 300), random(100, 300))
        ctx.stroke()

        ev = document.createEvent('MouseEvents')
        ev.initEvent('mouseup', true, true)
        c.dispatchEvent(ev)
        
        ev = document.createEvent('MouseEvents')
        ev.initEvent('click', true, true)
        c.dispatchEvent(ev)
    }, canvas)

    web.click('id=sign_accept')
    if (web.isVisible('id=sign_error', 1500)) {
        web.click('//button[@data-action="clear"]')
        sign('//div[@id="signature-pad--body"]//canvas')
        web.click('id=sign_accept')
    }
}

web.transaction('01. Initialize')
web.init()

const windowWidth = web.execute(() => { return window.innerWidth })
const windowHeight = web.execute(() => { return window.innerHeight })
windowWidth > 1920 && web.setWindowSize(1920, windowHeight)

web.transaction('02. Open Online Shop Page')
web.open('https://lubinski.co.il/online-shop/')

web.transaction('03. Open Car Model')
if (web.isVisible(`//div[@class="purchase-choose-model-main"]//*[text()="${carModel}"]`)) {
    web.click(`(//div[@class="purchase-choose-model-main"]//*[text()="${carModel}"]//..//..//..//..//..//..//a[@class="purchase"])[1]`)
} else {
    const newCarModel = web.getText('(//div[@class="purchase-choose-model-main"]//*[contains(@class, "headline__title")])[1]')
    web.click(`(//div[@class="purchase-choose-model-main"]//*[text()="${newCarModel}"]//..//..//..//..//..//..//a[@class="purchase"])[1]`)
    log.info(`Car Model ${carModel} wasn't found, new car model: ${newCarModel}`)
}

web.transaction('04. Choose Car Model')
web.click('(//div[@class="purchase-choose-model"]//div[contains(@class, "checkbox")])[1]')
var carVersion = web.getText('(//div[@class="purchase-choose-model"]//span[@class="o-link_title"])[1]')
log.info(`Version: ${carVersion}`)
web.pause(1000)

web.transaction('05. Open Extra Features')
web.click('//a[@title="המשך לבחירת תוספות"]')
web.pause(1000)

web.transaction('06. Open Car Color')
web.click('//a[@title="המשך לבחירת צבע"]')
web.pause(1000)

web.transaction('07. Choose Car Color')
web.click('(//div[@class="purchase-choose-color"]//div[contains(@class, "checkbox")])[1]')
var carColor = web.getAttribute('(//div[@class="purchase-choose-color"]//div[contains(@class, "checkbox")]//input)[1]', 'aria-label')
log.info(`Color: ${carColor}`)
web.pause(1000)

web.transaction('08. Open Car Accessories')
web.click('//a[@title="המשך לבחירת אביזרים"]')
web.pause(1000)

web.transaction('09. Open Summary')
web.click('//a[@title="המשך"]')
web.pause(1000)

var price = web.getText('//div[@class="label-model price"]')
var versionRresult = web.getText('(//div[@class="box-details"]//*[contains(text(), "רמת גימור")]//..//..//li[@class="item"])[1]')
var colorResult = web.getText('(//div[@class="box-details"]//*[contains(text(), "צבע")]//..//..//li[@class="item"])[1]')

log.info('*'.repeat(70))
log.info('Price Result: ' + price)
log.info('Color Result: ' + colorResult)
log.info('Version Rresult: ' + versionRresult)

web.transaction('10. Open Checkout Page')
web.click('//a[@title="להמשך הזמנה באונליין"]')
web.waitForVisible('//div[@class="checkout"]')

web.transaction('11. Enter Personal Details')
web.type('id=first_name', firstName)
web.type('id=last_name', lastName)
web.type('id=id', id)
web.type('id=phone', phone)
web.type('id=email', email)
web.select('id=showroom', 'index=1')

web.type('id=city', 'שחר')
web.click('//span[@class="item" and contains(text(), "שחר")]')

web.click('id=adress')
web.click('//span[@class="item" and contains(text(), "הקטיף")]')
web.type('id=house_number', '11')
web.click('id=privacy_policy')

web.transaction('12. Open Documents Page')
web.click('//a[@title="ממשיכים למסמכים"]')
web.waitForVisible('//div[@id="container"]//span[contains(text(), "הזמנת רכב חדש")]')

web.transaction('13. Sign New Car Order')
web.click('//div[@id="CustomerSignature"]//input[@aria-label="לחץ כאן לחתימה"]')
sign('//div[@id="signature-pad--body"]//canvas')
web.click('//div[@id="CustomerSignature"]//..//..//..//..//button[@id="nextBtn"]')

web.transaction('14. Sign Conditions')
web.click('//span[contains(text(), "תנאי הזמנה")]//..//..//..//..//..//..//..//input[@aria-label="לחץ כאן לחתימה"]')
sign('//div[@id="signature-pad--body"]//canvas')
web.click('//span[contains(text(), "תנאי הזמנה")]//..//..//..//..//..//..//..//..//button[@id="nextBtn"]')

web.transaction('15. Sign Bank Guarantee')
web.click('id=IsBankGuarantee_1')
web.click('//span[contains(text(), "קבלת ערבות בנקאית")]//..//..//..//..//..//input[@aria-label="לחץ כאן לחתימה"]')
sign('//div[@id="signature-pad--body"]//canvas')
web.click('//span[contains(text(), "קבלת ערבות בנקאית")]//..//..//..//..//..//..//button[@id="nextBtn"]')

web.transaction('16. Sign Car Owner Details')
web.click('(//span[contains(text(), "בעלי הרכב")]//..//..//..//..//..//..//..//input[@aria-label="לחץ כאן לחתימה"])[1]')
sign('//div[@id="signature-pad--body"]//canvas')
web.click('(//span[contains(text(), "בעלי הרכב")]//..//..//..//..//..//..//..//..//button[@id="nextBtn"])[1]')

web.transaction('17. Sign Future Trade In Commitment')
web.click('//*[contains(text(), "התחייבות לטרייד אין עתידי")]//..//..//..//..//..//..//..//..//..//input[@aria-label="לחץ כאן לחתימה"]')
sign('//div[@id="signature-pad--body"]//canvas')
web.click('(//span[contains(text(), "בעלי הרכב")]//..//..//..//..//..//..//..//..//button[@id="nextBtn"])[1]')

web.transaction('18. Submit Form')
web.click('id=submitBtn')
web.waitForVisible('//div[@class="payment"]')
log.info(web.getText('//div[@class="payment"]//div[@class="content"]'))
