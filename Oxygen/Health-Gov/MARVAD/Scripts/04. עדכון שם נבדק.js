const obj = po
const nav = obj.sub_nav
const utils = obj.utils
const func = obj.functions
const valid_ID = obj.valid_ID
const patients = obj.patients
const referrals = obj.referrals
const treatments = obj.treatments


obj.init(env.url, 30)
startTime = func.getTime()

func.navigateToNewReferral()
obj.type(referrals.idInput, valid_ID)


web.transaction('Find Patient')
obj.type(referrals.referralType, 'מל"ח')
obj.click(utils.searchResult)

obj.type(referrals.mainReason, 'ביקורת')
obj.click(utils.searchResult)

obj.click(referrals.referralDate)
obj.click(`//div[contains(@class, "dayIsFocused")]//span[text()="${func.getDay(func.currentDate())}"]`)

obj.click(nav.findPatient)
web.waitForExist(utils.dialogAccept)

obj.click(utils.dialogAccept)
obj.click(utils.bottomSaveButton)

web.waitForExist(utils.dialogAccept)
obj.click(utils.dialogAccept)


web.transaction('Assert Error Message')
web.waitForVisible('//label[contains(@title, "שדה נדרש אינו יכול להיות ריק")]')
if (web.isVisible(utils.inputErrorMessage)) {
    let error = func.getText(utils.inputErrorMessage)
    if (!error.includes('אינו יכול להיות ריק')) {
        log.info('לא התקבלה הודעת שגיאה על שדה איזור רישוי ריק')
    }
}

obj.type(referrals.rishuiOfficeArea, 'חיפה')
obj.click(utils.searchResult)

web.transaction('Save')
obj.click(utils.bottomSaveButton)

web.transaction("Open Patient's Personal Details And Create Treatment") 
obj.click(referrals.patient)
obj.click(patients.list.referralsAndTreatments)
obj.click(patients.addNewStandard_incident)

obj.type(treatments.caseType, 'אורתופד')
obj.click(utils.searchResult)
obj.click(utils.bottomSaveButton)

web.transaction('Assert Treatment Already Exists Message')
if (web.isVisible(utils.dialogHeader)) {
    let message = func.getText(utils.dialogHeader)
    message.includes('לנבדק קיים טיפול ניהולי פעיל') ? obj.click(utils.dialogCancel) : assert.fail('לא היה קיים טיפול ניהולי')
}

web.transaction('Return To The Patient And Change His/Her Name')
obj.click(treatments.patient)

if (web.isVisible(utils.dialogConfirm))
    obj.click(utils.dialogConfirm)

var statusExists = false
var currentStatus = ''
var randomName = 'שם רנדומלי'

if (web.isVisible(treatments.status)) {
    currentStatus = func.getText(treatments.status)
    statusExists = true
}


obj.click(patients.patientName)
while (web.getValue(patients.patientName).length >= 1) {
    func.pressBACKSPACE()
}

obj.type(patients.patientName, randomName)
func.pressTAB()

obj.click(utils.bottomSaveButton)

web.transaction('Assert Changed Name And Case Type')
if (web.getValue(patients.patientName) !== randomName) {
    assert.fail('לא שונה שם')
} else {
    obj.click(patients.list.referralsAndTreatments)
    if (statusExists) {
        web.waitForVisible(
            '(//div[@data-id="Event_for_the_subject_container"]'  
            + '//div[@title="' + randomName + '"]'
            + '//..//div[@title="' + currentStatus + '"])[1]'
        )
    } else {
        web.waitForVisible(
            '(//div[@data-id="Event_for_the_subject_container"]'
            + '//div[@title="' + randomName + '"])[1]'
        )
    }
}

web.transaction('Dismiss Treatment')
func.dismissTreatment()

endTime = func.getTime()
log.info(
    'Test finished in: ' 
    + parseFloat((endTime - startTime) / 1000).toFixed(1)
    + ' seconds.'
)
