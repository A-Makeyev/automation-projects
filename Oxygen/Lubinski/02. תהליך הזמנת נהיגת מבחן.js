const id = '999099999'
const phone = '0555555555'
const carModel = '2008 SUV'
const email = 'XXX@XXX.COM'
const firstName = 'אוטומציה'
const lastName = 'נהיגת מבחן'

web.transaction('01. Initialize')
web.init()

const windowWidth = web.execute(() => { return window.innerWidth })
const windowHeight = web.execute(() => { return window.innerHeight })
windowWidth > 1920 && web.setWindowSize(1920, windowHeight)

web.transaction('02. Open Online Shop Page')
const url = 'https://lubinski.co.il/test-drive/'
web.open(url)

var index = 0
var carModels = []
var carModelsElements = '//div[@class="purchase-choose-model-main"]//*[contains(@class, "headline__title")]'
var carModelsCount = web.getElementCount(carModelsElements)
var validCarModal = ''
var testDriveDate = ''

for (let i = 1; i <= carModelsCount; i++) {
    carModels.push(web.getText(`(${carModelsElements})[${i}]`))
}

function scheduleTestDrive(carModel) {
    let shortWait = 10 * 1000

    web.transaction('03. Open Car Model')
    web.click(`(//div[@class="purchase-choose-model-main"]//*[text()="${carModel}"]//..//..//..//..//..//..//a[@class="test-drive"])[1]`)

    web.transaction('04. Choose Test Drive Location')
    if (web.isVisible('id=engine', shortWait / 2)) 
        web.select('id=engine', 'index=1')
    web.select('id=showroom', 'index=1')

    web.transaction('05. Choose Test Drive Date')
    web.click('(//*[@class="dates-row"]//button)[1]')
    testDriveDate = web.getText('(//*[@class="dates-row"]//div[@class="date-block-wrap"])[1]')

    web.transaction('06. Open Personal Details Form')
    web.click('//a[@title="ממשיכים" and not (@disabled="disabled")]')

    web.transaction('07. Enter Personal Details')
    web.type('id=first_name', firstName)
    web.type('id=last_name', lastName)
    web.type('id=phone', phone)
    web.type('id=email', email)
    web.click('id=privacy_policy')

    web.transaction('08. Open Driver License Window')
    web.click('//a[@title="ממשיכים" and not (@disabled="disabled")]')

    if (web.isVisible('//div[@class="driver-license-photo"]', shortWait)) {
        log.info(`✅ ${testDriveDate}`)
        log.info(`✅ ${carModel}`)
        validCarModal = carModel
        return
    } else if (web.isVisible('//div[@class="loader-content error-state"]', shortWait)) {
        web.pause(500)
        log.info(
            '⚠️ (' + carModel + ' דגם) ' +
            web.getText('//div[@class="loader-content error-state"]//div[@class="title"]') + ' ' +
            web.getText('//div[@class="loader-content error-state"]//div[@class="subtitle"]') 
        )

        web.open(url)
    }
    if (index == carModels.length - 1) {
        log.info(`אין נהיגת נסיון זמינה כרגע ללקוח עם מספר זהות: ${id}`)
        assert.pass()
    } else {
        index += 1
        scheduleTestDrive(carModels[index])
    }
}
scheduleTestDrive(carModels[index])

web.transaction('09. Enter Driver License Details')
web.click('//button[@class="click-to-continue" and contains(text(), "הזנה ידנית של הפרטים")]')

web.type('id=id', id)
web.type('id=license_number', licenseNumber)
web.select('id=license_type', 'value=B')
web.type('id=first_name', firstName)
web.type('id=last_name', lastName)
web.type('id=city', 'שחר')

web.click('//span[@class="item" and contains(text(), "שחר")]')
web.click('id=adress')
web.click('//span[@class="item" and contains(text(), "הקטיף")]')
web.type('id=house_number', '11')

web.click('//input[@id="_date_birth"]')
web.click('(//div[@class="datepicker"]//*[@class="year"])[1]')
web.click('(//div[@class="datepicker"]//*[@class="month"])[1]')
web.click('(//div[@class="datepicker"]//*[@class="day"])[1]')

web.click('//input[@id="_licenseissuedate"]')
web.click('(//div[@class="datepicker"]//*[@class="year"])[1]')

web.click('//input[@id="_licensevalidate"]')
web.click('(//div[@class="datepicker"]//*[@class="year"])[1]')
web.click('(//div[@class="datepicker"]//*[@class="month"])[1]')
web.click('(//div[@class="datepicker"]//*[@class="day"])[1]')

web.transaction('10. Send Form')
web.click('//a[@title="סיימנו!"]')
web.waitForVisible('//div[@class="order-summary step-order-summary"]')

var summaryName = web.getText('//div[@class="order-summary step-order-summary"]//*[@class="title"]')
var summaryModel = web.getText('//div[@class="order-summary step-order-summary"]//*[@class="model"]')
var summaryDetails = web.getText('//div[@class="order-summary step-order-summary"]//*[@class="subtitle"]')
var testDriveDay = testDriveDate.replace(/\D/g, '')
var testDriveMonth = testDriveDate.replace(/[0-9]/g, '')
testDriveMonth = testDriveMonth.substring(0, 4)

if (!summaryName.includes(firstName)) {
    assert.fail(`השם שהוקלד (${firstName}) אינו מופיע במסך סיכום. (${summaryName} במקומו מופיע)`)
} else {
    log.info('✅ Summary Title: ' + summaryName)
}

if (!validCarModal.includes(summaryModel)) {
    assert.fail(`הדגם שנבחר (${validCarModal}) אינו מופיע במסך סיכום. (${summaryModel} במקומו מופיע)`)
} else {
    log.info('✅ Summary Model: ' + summaryModel)
}

if (!summaryDetails.includes(testDriveDay) && !summaryDetails.includes(testDriveMonth)) {
    assert.fail(`התאריך שנבחר (${testDriveDate}) אינו מופיע במסך סיכום.`)
} else {
    log.info('✅ Summary Details: ' + summaryDetails)
}
