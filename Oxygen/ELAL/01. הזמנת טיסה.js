const day = new Date().getDate()
const year = new Date().getFullYear()

web.transaction('01. Initialize')
web.init({
    'goog:chromeOptions': {
        "args": ['disable-blink-features=AutomationControlled']
    }
})

web.transaction('02. Open Home Page')
web.open('https://www.elal.com/')

web.transaction('03. Open Flights Search Page')
web.click('//header//a[contains(text(), "לתכנן")]')
web.clickHidden('//header//*[contains(text(), "טיסות זולות למגוון יעדים")]')
var tabs = web.getWindowHandles()
tabs.length == 2 ? web.selectWindow(tabs[1]) : web.selectWindow(tabs[0])

web.transaction('04. Enter Flight Details')
web.click('//div[@data-em-cmp="booking"]//label[contains(text(), "מוצא")]//..//input')
web.pause(1000)
web.type('//div[@data-em-cmp="booking"]//label[contains(text(), "מוצא")]//..//input', 'TLV')

web.sendKeys('\uE007')
web.waitForVisible('//div[contains(text(), "TLV, תל אביב, ישראל")]')

web.click('//div[@data-em-cmp="booking"]//label[contains(text(), "יעד")]//..//input')
web.pause(1000)
web.type('//div[@data-em-cmp="booking"]//label[contains(text(), "יעד")]//..//input', 'AMS')
web.sendKeys('\uE007')
web.waitForVisible('//div[contains(text(), "AMS, אמסטרדם, הולנד")]')

web.click('//input[@name="departureDateInput"]')
web.pause(1000)
web.click(`//div[contains(@aria-label, "${year}") and text()="${day}"]`)

web.click('//input[@name="returnDateInput"]')
web.pause(1000)
web.click(`//div[contains(@aria-label, "${year + 1}") and text()="${day}"]`)

web.transaction('05. Search Flights')
web.click('//button[@class="Booking_submitButton"]')

web.transaction('06. Assert Flights')
function assertFlightDetails() {
    let outboundFlight = web.getText('//span[contains(text(), "ט י ס ת   ה ל ו ך")]//..//..//*[contains(@class, "title--section")]')
    let returnFlight = web.getText('//span[contains(text(), "ט י ס ת   ח ז ו ר")]//..//..//*[contains(@class, "title--section")]')
    if (outboundFlight != 'תל אביב > אמסטרדם') assert.fail('טיסת הלוך מתל אביב לאמסטרדם אינה מוצגת')
    if (returnFlight != 'אמסטרדם > תל אביב') assert.fail('טיסת חזור מאמסטרדם לתל אביב אינה מוצגת')
    log.info('Outbound Flight: ' + outboundFlight)
    log.info('Return Flight: ' + returnFlight)
}

if (web.isVisible('//*[contains(text(), "אין טיסות בתאריך שבחרת")]')) {
    log.info('אין טיסות בתאריך שבחרת')

    web.transaction('06.01. Find Other Flights')
    web.click('//button[contains(text(), "מצאו לי תאריך קרוב")]')
    assert.equal(
        web.isVisible('//div[contains(text(), "חיפוש גמיש")]//..//..//flexible-search-calendar'), true,
        'מסך חיפוש גמיש של טיסות לא מופיע'
    )

    let flightsElements = '//div[contains(@class, "matric-cell__has-data")]'
    let flights = web.getElementCount(flightsElements)
    let randomFlight = Math.floor(Math.random() * flights) + 1

    for (let i = 1; i <= flights; i++) web.waitForVisible(`(${flightsElements})[${i}]`)
        
    log.info('Available flights: ' + flights)
    web.click(`(${flightsElements})[${randomFlight}]`)
    
    web.transaction('06.02. Choose Flight')
    web.click('//button[contains(text(), "בחירת טיסה")]')
    if (web.isVisible('//*[contains(text(), "לא מצאנו טיסות בתאריך שבחרת")]', 10 * 1000)) {
        web.transaction('06.03. Flights Were Not Found, Return To Home Page')
        web.click('//button[contains(text(), "שינוי תאריכי טיסה")]')
        web.waitForVisible('id=main')
        log.info('לא נמצאו טיסות בתאריך שנבחר, הועבר לעמוד הבית')
        assert.pass()
    } else {
        web.transaction('06.03. Assert Flight Details')
        web.waitForVisible('//flights-widget')
        assertFlightDetails()
    }
} else {
    assertFlightDetails()
}
