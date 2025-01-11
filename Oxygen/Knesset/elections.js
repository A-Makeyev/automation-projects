web.init()
web.setTimeout(5000)
web.open('http://startdemo.asp')

const PROTOCOL_TEST_ENV = 'https://demo.gov.il/MagicScripts/APPNAME=Kneset=LoginScreenProtokol'

web.transaction('כניסה לסביבת טסט')
web.waitForExist(`//a[@href="${PROTOCOL_TEST_ENV}"]`)
web.click(`//a[@href="${PROTOCOL_TEST_ENV}"]`)

web.transaction('כניסה לקליטת תוצאות')
web.waitForExist('//a[text()="קליטת פרוטוקולים"]')
web.click('//a[text()="קליטת פרוטוקולים"]')
web.pause(1000)
web.click('//a[text()="קליטת תוצאות מפרוטוקול קלפי"]')
web.selectFrame('name=I1')

web.transaction('מילוי נתונים')
// סמל ישוב
web.waitForExist('id=4P') 
web.clear('id=4P')
web.type('id=4P', '1015')

web.sendKeys('\uE004') // simulates a TAB keypress

// סמל קלפי
web.clear('name=semelkalpi')
web.type('name=semelkalpi', '1')
web.sendKeys('\uE004')

// מספר ברזל
web.click('id=editForm')
// תוצאות הצבעה בקלפי לבחירות לכנסת
web.waitForExist('name=ifm31')
web.selectFrame('name=I1', 'name=ifm31')

// מספר מעטפות חיצוניות
web.clear('name=misparHizoniTd')
web.type('name=misparHizoniTd', '35')
web.sendKeys('\uE004')

// מספר מעטפות בתיבת הקלפי
web.clear('name=misparMatzbeemTeiva')
web.type('name=misparMatzbeemTeiva', '700')
web.sendKeys('\uE004')

// סהכ הקולות הפסולים כולל מעטפות ריקות
web.clear('name=misparPsulimTd')
web.type('name=misparPsulimTd', '0')
web.sendKeys('\uE004')

// סהכ הקולות הכשרים
web.clear('name=misparPsulimTd')
web.type('name=misparPsulimTd', '700')
web.sendKeys('\uE004')

// קולות כשרים לרשימות
for (let kol = 0; kol < 7; kol++) {
    web.clear(`//input[@name="kolotreshima_${kol}"]`)
    web.type(`//input[@name="kolotreshima_${kol}"]`, '100')
    web.sendKeys('\uE004')
    web.pause(500)
}


web.clear('name=misparKsherimProtokolTd')
web.type('name=misparKsherimProtokolTd', '700')

web.click('name=btnBdika')
web.alertAccept()

web.click('name=btnShmira')
web.alertAccept()
web.dispose()


/*
 *   web.execute(() => {
 *       var keyboardEvent = document.createEvent("KeyboardEvent")
 *       var initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? 'initKeyboardEvent' : 'initKeyEvent'
 *       keyboardEvent[initMethod] (
 *           'keydown', true, true, window, false, false, false, false, 9, 0
 *       )
 *       document.dispatchEvent(keyboardEvent)
 *   })
 */