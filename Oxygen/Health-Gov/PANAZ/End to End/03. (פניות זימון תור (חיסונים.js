const obj = po
const nav = obj.nav
const cases = obj.cases
const utils = obj.utils
const fun = obj.functions
const manager = obj.ribbonManager

function getText(locator) {
    let text = web.getText(locator)
    let loops = 0
    if (text.length < 1) {
        while (text.length < 1) {
            web.pause(1000)
            text = web.getText(locator)
            loops++
            if (loops > 15) {
                break
            }
        }
    }
    return text
}

function getPniyaNumber() {
    let loops = 0

    web.selectFrame(utils.frames.frame_1) // frame -> #1
    web.waitForExist(cases.pniyaNumber)

    var pniyaNumber = web.getText(cases.pniyaNumber)
    var pniyaIsNumeric = pniyaNumber.match(/\d+/g)

    while (pniyaIsNumeric == null || pniyaIsNumeric.includes('פריט פניה חדש')) {
        pniyaNumber = web.getText(cases.pniyaNumber)
        pniyaIsNumeric = pniyaNumber.match(/\d+/g)
        loops++
        web.pause(1000)
        if (loops > 15) {
            break
        }
    }

    log.info(`פניה: ${pniyaNumber}`)
    return pniyaNumber
}

function getContactName() {
    var name = web.getText(cases.contactName)
    if (name.length < 1) {
        let loops = 0
        while (name.length < 1) {
            name = web.getText(cases.contactName)
            loops++
            if (loops > 15) {
                break
            }
        }
    }
    return name
}


web.transaction('01. Initialize Selenium')
web.init()


web.transaction('02. Open Main Page As App User')
startTime = fun.getTime()
obj.login(
    obj.users.app_user.username,
    obj.users.app_user.password,
    env.url, 30
)


web.transaction('03. Open Cases Page')
fun.navigateToCases()


web.transaction('03. Open New Case')
obj.click(manager.cases.newCase)
web.selectFrame(obj.utils.frames.frame_1) // frame -> #1


web.transaction('04. Create New Case')
fun.createPniya(obj.ID, 'מידע', 'זימון תור', 'discription', 'up')
web.waitForExist(cases.serviceTypeField)

var contact = getContactName()
log.info('Contact: ' + contact)

// for (let x = 0; x < 4; x++) {
//     fun.pressTAB()
//     if (x == 3) {
//         web.sendKeys('אילת- חיסונים חו"ל')
//         fun.pressTAB()
//         break
//     }
// }

obj.click(cases.serviceTypeField)
web.sendKeys('אילת- חיסונים חו"ל')
fun.pressTAB()


web.transaction('05. Validate Details')
const team = '//span[@id="el_id_team_lookupValue"]'
const subject = '//span[@id="el_id_subjectmain_type_lookupValue"]'
const subSubject = '//span[@id="el_id_subjectsub_type_lookupValue"]'

if (getText(team) === 'לשכת בריאות אילת') {
    if (getText(subSubject) === 'חיסונים לקראת יציאה לחו"ל') {
        if (getText(subject) === 'קביעת תור') {

            web.transaction('06. Save Case')
            fun.savePniya()
        }
    }
} else { 
    assert.fail('לא הוצגו נתונים תקינים ל: אילת- חיסונים חו"ל')
}


web.transaction('07. Open Service Appointments')
var pniya = getPniyaNumber()
web.selectWindow(`title=פניה: ${pniya}`)

obj.click(manager.moreOptionsBtn)
obj.click(manager.cases.moreOptions.serviceActivity)

web.selectWindow('title=פעילות שירות: פריט פעילות שירות חדש - Microsoft Dynamics CRM')
web.pause(3000) // --> weird window bug


web.transaction('08. Fetch Appointments Time')
obj.click(manager.serviceAppointment.time)

if (!web.isVisible(utils.frames.dialogFrame)) {
    let loops = 0
    while (!web.isVisible(utils.frames.dialogFrame)) {
        web.pause(1000)
        loops++
        if (loops > 15) {
            break
        }
    }
}

assert.equal(web.isVisible(utils.frames.dialogFrame), true)
web.selectFrame(utils.frames.dialogFrame)


web.transaction('09. Create New Service Appointment')
obj.click(utils.serviceAppointment_searchDateBtn)
obj.click(utils.serviceAppointment_firstResult)
obj.click(utils.serviceAppointment_bookBtn)


web.transaction('10. Save Service Appointment')
obj.click(manager.serviceAppointment._save)
log.info(`נקבע תור ל${contact}`)

if (web.isExist(utils.alertJS_dialogWindow)) {
    if (web.getText(utils.alertJS_dialog_message).includes(`נקבע תור ל${contact}`)) {
        obj.click(utils.alertJS_dialog_yes)

        // try {
        //     if (web.isAlertPresent()) {
        //         web.assertAlert('ההודעה נשלחה ללקוח')
        //     }
        // } catch(e) { log.info(e) }

    }
} else {
    log.info(`לא הוצגע הודעת מידע עבור ${contact}`)
}

web.selectWindow()
web.selectFrame(utils.frames.frame_)


web.transaction('11. Validate Contact Details')
var displayedSubject = web.getValue('//input[@id="subject"]')
if (displayedSubject.length < 1) {
    let loops = 0
    while (displayedSubject.length < 1) {
        displayedSubject = web.getValue('//input[@id="subject"]')
        loops++
        if (loops > 15) {
            break
        }
    }
}

if (!displayedSubject.includes(contact)) {
    assert.fail('שם איש הקשר אינו מוצג בנושא')
} else {
    web.selectWindow()

    web.transaction('12. Save Service Appointment And Close')
    obj.click(manager.serviceAppointment.saveAndClose)
}

// keep only the date & time
var appointment_date = displayedSubject.replace(/[^0-9:/]/g, '')
appointment_date = `${appointment_date.slice(0, 10)} ${appointment_date.slice(10)}`

log.info('Date & Time: ' + appointment_date)


web.transaction('13. Assert Created Appointment')
web.selectWindow(`title=פניה: ${pniya}`)
web.selectFrame(utils.frames.frame_1)
web.pause(1000)

var displayedLabel = web.getText('//label[@id="תיאור כללי_label"]')
if (displayedLabel.length < 1) {
    let loops = 0
    while (displayedLabel.length < 1) {
        displayedLabel = web.getText('//label[@id="תיאור כללי_label"]')
        loops++
        if (loops > 15) {
            break
        }
    }
}

log.info(displayedLabel)

if (!displayedLabel.includes(`זומן תור ל${contact}`)) {
    assert.fail(`לא זומן תור ל${contact}`)
} else {
    web.transaction('14. Save Case')
    fun.savePniya()
}


web.transaction('15. Find Appointment')
web.selectWindow(`title=פניה: ${pniya}`)
web.selectFrame(utils.frames.frame_1)

const appointmentLocator = `(//div[@id="serviceAppointment"]//div[contains(text(), "מתוזמן")]//..//..//div[contains(text(), "${appointment_date}")])[1]`

if (web.isVisible(appointmentLocator) === false) {
    let loops = 0
    while (!web.isVisible(appointmentLocator)) {
        obj.click(utils.serviceAppointment_nextBtn)
        web.pause(2500)

        if (web.isVisible(appointmentLocator) === true) {
            web.doubleClick(appointmentLocator)
            break
        } 

        loops++
        if (loops > 15) {
            break
        }
    }
    
} else {
    web.doubleClick(appointmentLocator)
}


web.transaction('16. Open Close Appointment Window')
web.selectWindow()
obj.click(manager.serviceAppointment.closeAppointment)

web.pause(1500)
web.selectFrame(utils.frames.dialogFrame)
web.select(utils.serviceAppointment_close_status, 'label=בוטל')

obj.click(utils.closeDialog)


web.transaction('17. Save And Close Appointment ')
obj.click(manager.serviceAppointment.saveAndClose)

web.dispose('Passed')
endTime = fun.getTime()
log.info(`Test finished in: ${parseFloat((endTime - startTime) / 1000).toFixed(1)} seconds.`)