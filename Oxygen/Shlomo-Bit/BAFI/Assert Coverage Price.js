var futureDate = po.utils.futureDate(2)
var gender = 'נקבה'

function errorCheck() {
    if (web.isVisible('//app-error-dialog', 1500)) {
        assert.fail(web.getText('//div[@class="error-dialog-content"]'))
    }
}

 
web.init()
web.open('http://nk-ins.test')

web.type('//input[@name="username"]', env.user)
web.type('//input[@name="tznumber"]', env.TZnumber)
web.type('//input[@name="password"]', env.pass)

 
web.click('//button[@id="login-btn"]')
web.click('//*[@id="redirectTravel"]')
web.selectWindow('title=ביטוח נסיעות לחו"ל')

web.type('//input[@data-placeholder="מספר סוכן"]', '300070')
web.type('//input[@id="mat-input-0"]','טסט')
web.type('//input[@id="mat-input-1"]','בדיקה')
web.type('//input[@id="mat-input-3"]','333333')

web.click('//div[@id="mat-select-value-1"]')
web.click('//mat-label[contains(text(), "קידומת")]')
web.click('//span[@class="mat-option-text" and contains(text(), "052")]')
web.click('//button[@id="manualBox"]')


var handles = web.getWindowHandles()
web.selectWindow(handles[2])

web.click('//mat-checkbox[@id="private-policy"]')
web.click('//button[contains(text(), "מתחילים")]')
web.click('//input[@name="startDate"]')

web.type('//input[@name="startDate"]', po.utils.currentDate(false))
web.type('//input[@name="endDate"]', futureDate)
  
web.click('//button[contains(text(), "המשך")]')
web.click('//li[contains(text(), "אירופה")]')
web.click('//span[contains(text(), "לא")]')
web.click('//*[contains(text(), "המדינה שבה אבקר")]//..//mat-select')
web.click('//span[contains(text(),"דנמרק")]')
web.click('//button[contains(text(), "המשך")]')
web.click(`//button[@aria-label="${gender}"]`)
web.click('//button[contains(@class, "ui-datepicker-trigger")]')
web.click('//a[text()="16"]')
web.click('(//span[contains(text(), "כן")])[1]')

 
web.scrollToElement('//button[contains(text(), "המשך")]')
web.click('//button[contains(text(), "המשך")]')
web.click('(//span[contains(text(), "לא")])[1]')
web.click('(//span[contains(text(), "לא")])[2]')
web.click('(//span[contains(text(), "לא")])[3]')


if (gender == 'נקבה') {
    if (web.isVisible('//*[contains(text(), "האם את בהריון?")]', 5000)) {
        web.click('//*[contains(text(), "האם את בהריון?")]//..//..//span[contains(text(), "לא")]')
    }
}

web.click('//button[contains(text(), "המשך")]')

function addAndSave(btn) {
    errorCheck()
    web.click(`//*[contains(text(), "${btn}")]`)
    errorCheck()
}

// חבות כלפי צד שלישי
web.click('//*[contains(text(), "חבות כלפי צד שלישי")]')
addAndSave('שמור')

// הוצאות איתור וחילוץ
web.click('//*[contains(text(), "הוצאות איתור וחילוץ")]')
addAndSave('שמור')

// הרחבה לכיסוי כבוּדה
web.click('//*[contains(text(), "הרחבה לכיסוי כבוּדה")]')
addAndSave('הוסף כיסוי')

// הרחבה לקיצור וביטול נסיעה
web.click('//*[contains(text(), "הרחבה לקיצור וביטול נסיעה")]')
addAndSave('הוסף כיסוי')

//  כיסוי בגין מגפה
web.click('//*[contains(text(), "כיסוי בגין מגפה")]')
addAndSave('הוסף כיסוי')

// הרחבה לכיסוי ספורט אתגרי
web.click('//*[contains(text(), "הרחבה לכיסוי ספורט אתגרי")]')
addAndSave('שמור')

// הרחבה לכיסוי ספורט חורף
web.click('//*[contains(text(), "הרחבה לכיסוי ספורט חורף")]')
addAndSave('שמור')

// הרחבה לכיסוי ספורט במסגרת תחרותית
web.click('//*[contains(text(), "הרחבה לכיסוי ספורט במסגרת תחרותית")]')
addAndSave('שמור')

// הרחבה לכיסוי גניבה של טלפון נייד
web.click('//*[contains(text(), "הרחבה לכיסוי גניבה של טלפון נייד")]')
web.type('//input[@data-placeholder="דגם טלפון נייד"]', 'Huewewi')
addAndSave('שמור')

// הרחבה לכיסוי גניבה או נזק לאופניים
web.click('//*[contains(text(), "הרחבה לכיסוי גניבה או נזק לאופניים")]')
web.type('//input[@data-placeholder="דגם אופניים"]', 'BMX')
web.type('//input[@data-placeholder="שלדת אופניים"]', 'עץ')
web.click('(//mat-select)[2]')
web.click('(//span[@class="mat-option-text"])[1]')
addAndSave('שמור')

// הרחבה לכיסוי גניבה של מחשב נייד
web.click('//*[contains(text(), "הרחבה לכיסוי גניבה של מחשב נייד")]')
web.type('//input[@data-placeholder="דגם מחשב נייד"]', 'ipad')
addAndSave('שמור')

// הרחבה לכיסוי גניבה של מצלמה
web.click('//*[contains(text(), "הרחבה לכיסוי גניבה של מצלמה")]')
web.type('//input[@data-placeholder="דגם מצלמה"]', 'iCanon')
addAndSave('שמור')

// קרוואן/רכב שכור בחו"ל
web.click(`//*[contains(text(), 'קרוואן/רכב שכור בחו"ל')]`)
web.click('//span[contains(text(), "רכב")]')

if (web.isVisible('(//mat-error)[1]', 3000)) {
    web.click('(//button[@class="remove-traveler-button"])[2]')
}

addAndSave('שמור')

// הרחבה להוצאות רפואיות בישראל שלא בעת אשפוז עקב אירוע תאונתי בחו״ל
web.click(`//*[contains(text(), 'הרחבה להוצאות רפואיות בישראל שלא בעת אשפוז עקב אירוע תאונתי בחו״ל')]`)
addAndSave('שמור')

var sum = 0
var coverTitle = '//*[@class="policy-cover__title"]'
var priceElements = '//div[@class="policy-cover_price"]'
var priceElementsCount = web.getElementCount(priceElements)

for (let i = 1; i <= priceElementsCount; i++) {
    web.scrollToElement(`(${priceElements})[${i}]`)

    let price = web.getText(`(${priceElements})[${i}]`)
    if (price != '') {
        price = price.replace('$', '')
        price = parseFloat(price)
        sum += price
    }
    log.info(`${web.getText(`(${coverTitle})[${i}]`)} price: ${price = price == '' ? 0 : price}`)
}

web.scrollToElement('//*[@class="payment-price__value"]')

var totalPrice = web.getText('//*[@class="payment-price__value"]')
var tries = 10
while (totalPrice == '') {
	if (tries == 0) {
		break
	}
    totalPrice = web.getText('//*[@class="payment-price__value"]')
	tries--
}

if (totalPrice == sum) {
	assert.pass(`Total price (${totalPrice}) equals sum (${sum})`)
} else {
	assert.fail(`Expected total price to be: ${sum} instead got: ${totalPrice}`)
}
