const obj = po
const nav = obj.sub_nav
const utils = obj.utils
const func = obj.functions
const valid_ID = obj.valid_ID
const patients = obj.patients
const referrals = obj.referrals
const treatments = obj.treatments


function assertErrorMessage() {
    if (web.isVisible(utils.dialogHeader, 5000)) {
        web.transaction('Assert Treatment Already Exists Message')
        const message = func.getText(utils.dialogHeader)
        if (message.includes('לנבדק קיים טיפול ניהולי פעיל') || message.includes('שמירה מתבצעת')) {
            obj.click(utils.dialogCancel)
        } else {
            assert.fail('לא היה קיים טיפול ניהולי')
        }
        func.refresh()
    }
}

function dismissTreatment() {
    obj.click(nav.menu.treatments)
    if (web.isVisible('id=dialogTitleText', 5000)) {
        obj.click(utils.dialogConfirm)
    }

    if (web.isVisible('//span[contains(text(), "אין נתונים זמינים")]', 5000)) {
        log.info('לא קיימים טיפולים ניהוליים')
    } else {
        web.doubleClick('(//div[@data-id="grid-cell-container"])[1]')
        obj.click(nav.closeTreatment)
        obj.click(utils.dialogConfirm)
        obj.type('//input[@data-id="resolution_id.fieldControl-text-box-text"]', 'נפתר')
        obj.click(utils.dialogResolve)
    }
}


obj.init(env.url, 30)
startTime = func.getTime()

func.navigateToNewReferral()
func.createNewReferral(valid_ID, 'מל"ח', 'ביקורת')

if (web.isVisible('id=dialogTitleText', 5000)) {
    obj.click(utils.dialogAccept)
}

web.transaction("Open Patient's Personal Details And Create Treatment") 
obj.click(referrals.patient)
obj.click(patients.list.referralsAndTreatments)
obj.click(patients.addNewStandard_incident)

obj.type(treatments.caseType, 'אורתופד')
obj.click(utils.searchResult)

obj.click(utils.bottomSaveButton)
assertErrorMessage()


web.transaction('Create New Hatlaya')
obj.click('//li[@title="התליות"]')

var lastHaylayaInput = '//input[contains(@aria-label, "התלייה אחרונה")]'
if (web.isVisible(lastHaylayaInput)) {
    web.point(lastHaylayaInput)
    obj.click(lastHaylayaInput)

    for (let x = 0; x < 2; x++) {
        func.pressTAB()
    }
    func.pressENTER()

    if (web.isVisible(utils.dialogWindow, 3000)) {
        obj.click(utils.dialogCancel)
    }

    if (web.isVisible('//select[@title="סוג התלייה"]', 3000)) {
        web.select('//select[@title="סוג התלייה"]', 'label=רפואית')
        func.pressTAB()

        obj.type('//input[contains(@aria-label, "סיבת התלייה")]', 'מטבולית')
        for (let x = 0; x < 2; x++) {
            func.pressTAB()
        }
        func.pressENTER()
    }

    obj.click('//input[@data-id="mirs_to_close_date.fieldControl-date-time-input"]')
    obj.click(`//div[contains(@class, "dayIsFocused")]//span[text()="${func.getDay(func.currentDate())}"]`)

    obj.click(utils.bottomSaveButton)
    assertErrorMessage()
}


web.transaction('Assert Hatlaya')
obj.click('//li[@title="התליות"]')

if (web.isVisible(utils.dialogWindow))
    obj.click(utils.dialogAcceptText)

var currentPatient = func.getText('//h1[@data-id="header_title"]')
var hatlayaPatient = func.getText('//label[text()="התלייה אחרונה"]//..//..//..//..//label[contains(@data-id, "mirs_last_license_suspension")]')

currentPatient = currentPatient.split(/\s+/)
hatlayaPatient = hatlayaPatient.split(/\s+/)

log.info('Current Patient: ' + currentPatient[0])
log.info('Hatlaya Patient: ' + hatlayaPatient[0])

if (currentPatient[0] != hatlayaPatient[0])
    log.info('There was a problem with creating the hatlaya')


web.transaction('Close Treatment')
dismissTreatment()
func.refresh()


endTime = func.getTime()
log.info(
    'Test finished in: ' 
    + parseFloat((endTime - startTime) / 1000).toFixed(1)
    + ' seconds.'
)
