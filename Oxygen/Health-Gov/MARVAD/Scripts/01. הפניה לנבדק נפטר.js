const obj = po
const utils = obj.utils
const nav = obj.sub_nav
const func = obj.functions
const referrals = obj.referrals
const deceased_patient_ID = '999999999'


obj.init(env.url, 60)
startTime = func.getTime()


web.transaction('Create New Referral')
func.navigateToNewReferral()
web.assert
obj.type(referrals.idInput, deceased_patient_ID)
func.pressTAB()

// מקור
obj.type(referrals.referralType, 'צה"ל')
obj.click(utils.searchResult)

// סיבה
obj.type(referrals.mainReason, 'מיוחדת')
obj.click(utils.searchResult)

// תאריך
obj.click(referrals.referralDate)
obj.click(`//div[contains(@class, "dayIsFocused")]//span[text()="${func.getDay(func.currentDate())}"]`)

// אתר נבדק
obj.click(nav.findPatient)

web.transaction('Assert Deceased Patient')
log.info('Alert present? ' + web.isAlertPresent())
web.pause(3000)
log.info('Alert present after 3 seconds? ' + web.isAlertPresent())

if (web.isAlertPresent()) {
    if (assert.equal(web.assertAlert('הנבדק נפטר, האם לסגור את ההפניה?'), true)) {
        assert.pass()
    } else {
        assert.fail('Run Time Error from Marvad Driver Data Service')
    } 
} else {
    assert.fail('המערכת לא זיהתה נבדק נפטר')
}


endTime = func.getTime()
log.info(
    'Test finished in: '
    + parseFloat((endTime - startTime) / 1000).toFixed(1)
    + ' seconds.'
)