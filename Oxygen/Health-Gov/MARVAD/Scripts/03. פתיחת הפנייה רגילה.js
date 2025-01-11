const obj = po
const nav = obj.sub_nav
const utils = obj.utils
const func = obj.functions
const referrals = obj.referrals
const valid_ID = '999999999'

obj.init(env.url, 60)
startTime = func.getTime()

func.navigateToNewReferral()
obj.type(referrals.idInput, valid_ID)
func.pressTAB()


web.transaction('Find Patient')
obj.type(referrals.referralType, 'מל"ח')
obj.click(utils.searchResult)

obj.type(referrals.mainReason, 'ביקורת')
obj.click(utils.searchResult)

obj.click(referrals.referralDate)
obj.click(`//div[contains(@class, "dayIsFocused")]//span[text()="${func.getDay(func.currentDate())}"]`)

obj.click(nav.findPatient)

if (!web.isVisible(utils.dialogAccept)) {
    let loops = 0
    while (!web.isVisible(utils.dialogAccept)) {
        web.pause(1000)
        if (web.isVisible(utils.dialogAccept)) {
            break
        }
        loops++
        if (loops > 15) {
            break
        }
    }
}

if (web.isVisible(utils.dialogAccept)) {
    obj.click(utils.dialogAccept)
}

obj.click(utils.bottomSaveButton)
obj.click(utils.dialogAccept)

web.transaction('Assert Error Message')
web.waitForVisible(utils.inputErrorMessage)
if (web.isVisible(utils.inputErrorMessage)) {
    let error = web.getText(utils.inputErrorMessage)
    if (!error.includes('אינו יכול להיות ריק')) {
        log.info('לא התקבלה הודעת שגיאה על שדה איזור רישוי ריק')
    }
}

obj.type(referrals.rishuiOfficeArea, 'חיפה')
obj.click(utils.searchResult)

web.transaction('Save And Accept')
obj.click(utils.bottomSaveButton)

endTime = func.getTime()
log.info(
    'Test finished in: '
    + parseFloat((endTime - startTime) / 1000).toFixed(1)
    + ' seconds.'
)