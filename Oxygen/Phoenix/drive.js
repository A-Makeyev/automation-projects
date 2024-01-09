web.init()
web.setTimeout(10000)
const pageObjects = require('./PageObjects.js')

function next() {
    web.waitForExist(pageObjects.mainPage.submitBtn)
    web.click(pageObjects.mainPage.submitBtn)
    web.pause(1500)
}

web.transaction('כניסה למסך הראשי ולחיצה על קבלת הצעת מחיר')
web.open(pageObjects.drivePageUrl)
next()

web.transaction('מילוי פרטים')
web.type(pageObjects.form.slider, '7000')
next()

var checkBoxes = web.getElementCount('//span[@class="MuiIconButton-label"]')
log.info('Number of checkboxed: ' + checkBoxes)
for (let x = 1; x <= checkBoxes -1; x++) {
    web.click(`(//span[@class="MuiIconButton-label"])[${x}]`)
}

function firstActions() {
    next()

    web.type(pageObjects.form.firstName, 'אנטולי')
    web.type(pageObjects.form.phoneNumber, '05555555555')
    next()

    web.type(pageObjects.form.carPlate, '55555555')
    next()

    web.waitForExist('//span[@class="MuiButton-label" and contains(text(), "אפשר להמשיך")]')
    web.click('//span[@class="MuiButton-label" and contains(text(), "אפשר להמשיך")]')


    web.transaction('קבלת הצעה') 
    web.waitForText('(//div[@class="StyledOfferDetails__MainTitle-jmsdMw gdqwEX"]/div)[1]', 'יש לנו הצעה מצוינת בשבילך')
    next()
}

firstActions()

// קופץ מסך נמצאה בעיה ?
function handleError() {
    if (web.isExist('//span[contains(text(), "נמצאה בעיה בפרטים")]')) {
        web.click('//span[contains(text(), "שליחה")]')
        web.pause(3000)
        next()
        next()
        for (let x = 1; x <= checkBoxes -1; x++) {
            web.click(`(//span[@class="MuiIconButton-label"])[${x}]`)
        }
        firstActions()
    }
}

if (!web.isExist('//span[contains(text(), "מאיזה תאריך נתחיל את הביטוח?")]')) {
    handleError()
}

next()

//handleError()

web.waitForExist('id=driverIsOwner-כן')
web.click('id=driverIsOwner-כן')
next()

//handleError()

web.click('id=gender-male')
// web.click('id=gender-female')
next()

web.type('name=dateOfBirth-day-input', '17')
web.type('name=dateOfBirth-month-input', '08')
web.type('name=dateOfBirth-year-input', '1993')
web.type('id=licenseFirstIssuingYear', '2013')
next()

web.waitForExist('//span[contains(text(), "כמה שנים רצופות היה ביטוח על שמך?")]')
web.click('id=numberOfInsuranceYears-1')
next()

web.waitForExist('//span[contains(text(), "האם היו תביעות או שלילות בשנים בהן היה ביטוח על שמך?")]')
web.click('id=totalClaims-לא')
next()

web.waitForExist('//span[contains(text(), "מה מספר תעודת הזהות שלך?")]') 
web.type('//*[@id="idNumber"]', '314488651')
next()

web.waitForExist('//span[contains(text(), "האם יש נהג עיקרי צעיר ממך שינהג באופן קבוע ברכב?")]')
web.click('id=driversYoungerThanYou-לא')
next()

web.waitForExist('//button[@id="submit"]/span[text()="ממשיכים לרכישה"]')
web.click('//button[@id="submit"]/span[text()="ממשיכים לרכישה"]')

web.waitForText('//h1[@class="components__FormPageTitle-lijOaM kQLaIs"]/span', 'מעולה, עוד כמה שלבים ויש לך ביטוח')
web.type('id=lastName', 'מקייב')
next()

web.waitForText('//h1[@class="components__FormPageTitle-lijOaM kQLaIs"]/span', 'פרטים לשליחת פרטי הביטוח')
web.type('id=emailAddress', 'anatoly.makeyev@cloudbeat.io')
web.click('id=policyInEmail')
next()

// google element

web.waitForText('//h1[@class="components__FormPageTitle-lijOaM kQLaIs"]/span', 'פרטים לשליחת פרטי הביטוח')

//handleError()

web.pause(1500)
web.type('id=googleAddress', 'יעקוב שטיינברג 29')
web.pause(1500)
web.type('id=googleAddress', '\uE007') // Press ENTER
web.pause(1500)
next()

web.waitForExist('//span[contains(text(), "אם הרכב משועבד, נדאג לשלוח את העתק הביטוח גם לגורם המשעבד")]')
web.click('id=existenceOfLien-לא')
next()

web.pause(10000)

web.waitForExist('//span[contains(text(), "אני מאשר/ת את תנאי הפוליסה")]')
web.click('id=confirm-summary')
next()


web.waitForExist('id=numberPayments')

var expectedValue = 'מספר תשלומים'
var actualValue = web.getValue('id=numberPayments')
log.info('Actual value: ' + actualValue)

if (expectedValue != actualValue) {
    assert.fail('אינו מציג מספר תשלומים')
}

web.dispose()