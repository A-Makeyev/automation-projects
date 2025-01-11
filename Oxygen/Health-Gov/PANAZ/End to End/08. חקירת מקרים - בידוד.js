const obj = po
const korona = obj.korona
const func = obj.functions
const ncov = korona.NCOV
const manager = korona.ribbonManager
const fakeId = '999999999' // String(Math.random()).slice(2, 11)

function navigateToNCOV() {
    obj.click(korona.nav.koronaOptionsArrow)
    obj.click(korona.nav.koronaOptions.NCOV)
}

web.transaction('01. Initialize Selenium')
web.init()

web.transaction('02. Open Main Page As App User')
startTime = func.getTime()
obj.login(
    obj.users.app_user.username,
    obj.users.app_user.password,
    env.url_korona, 60, false
)

web.transaction('03. Open NCOV Page')
navigateToNCOV()
web.selectFrame(obj.utils.frames.frame_0)

if (web.isVisible(korona.utils.errorMsg, 5000)) {
    assert.fail(func.getText(korona.utils.errorMsg))
}

web.transaction('04. Validate That Fake ID doesn\'t exist')
func.fillField(ncov.searchInput, ncov.searchInput, fakeId)
func.pressENTER()

if (web.isVisible('//div[@class="cc-grid-noRecordslabel"]', 5000)) {
    let data = func.getText('//div[@class="cc-grid-noRecordslabel"]')
    if (data.includes('אין נתונים זמינים')) {
        log.info(data)
    }
} else {
    assert.fail('Fake ID exists')
}


web.transaction('05. Create New Investigation Form')
web.selectWindow()
obj.click(manager._new)
web.selectFrame(obj.utils.frames.frame_1)

if (func.getText('//div[@id="FormTitle"]/h1').includes('חקירת NCOV')) {
    assert.fail('לא נפתח טופס שאלון לחוקר')
}


web.pointJS(ncov.newContactField)
obj.click(ncov.newContactSearchBtn)
obj.click(ncov.addNewContactBtn)

web.selectWindow()
web.waitForVisible(ncov.newContactHeader)
assert.contain(func.getText(ncov.newContactHeader), 'יצירה מהירה: מטופל')

for (let x = 0; x < 4; x++)
    func.pressARROW_DOWN()
func.pressENTER()



web.dispose('Passed')
endTime = func.getTime()
log.info(`Test finished in: ${parseFloat((endTime - startTime) / 1000).toFixed(1)} seconds.`)