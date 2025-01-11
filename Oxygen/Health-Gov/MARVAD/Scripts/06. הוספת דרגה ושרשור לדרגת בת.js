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
func.createNewReferral(valid_ID, 'מל"ח', 'ביקורת')

if (web.isVisible(utils.dialogWindow))
    obj.click(utils.dialogAccept)


web.transaction("Open Patient's Driving Details ") 
if (web.isExist(referrals.patient)) 
    obj.click(referrals.patient)
else
    assert.fail('Patient was not displayed')


obj.click(patients.list.drivers)

const driversRanks = ['D', 'B', 'C', 'C1', 'E']
for (let x = 0; x < driversRanks.length; x++) {
    if (web.isVisible(`//div[contains(@data-lp-id, "License_Ranks") and @title="${driversRanks[x]}"]`)) {
        web.doubleClick(`//div[contains(@data-lp-id, "License_Ranks") and @title="${driversRanks[x]}"]`)
        break
    }
}

if (web.isChecked(patients.requestedLicense)) {
    obj.click(utils.bottomSaveButton)
} else {
    obj.click(patients.requestedLicense)
    obj.click(utils.bottomSaveButton)
}

endTime = func.getTime()
log.info(
    'Test finished in: ' 
    + parseFloat((endTime - startTime) / 1000).toFixed(1)
    + ' seconds.'
)
