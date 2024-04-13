const utils = po.utils
const homePage = po.homePage
const loginScreen = po.loginScreen
const stationsPage = po.stationsPage

mob.transaction(`01. Choose ${env.name} Environment`)
po.init(env.name)

mob.transaction(`02. Login With Phone Number -> ${env.phoneNumber}`)
loginScreen.loginWithPhoneNumber(env.phoneNumber, env.otpNumber)

mob.transaction('03. Open Stations')
utils.click(homePage.stationsButton)

mob.transaction('04. Search Station Location')
let station = 'תל אביב'
mob.type(stationsPage.searchInput, station)

mob.transaction('05. Assert Station Location')
if (mob.isVisible(stationsPage.firstStation)) {
    let firstStationLocation = mob.getText(`(${stationsPage.firstStation}//..//android.widget.TextView[contains(@text, "${station}")])[1]`)
    log.info(`נמצאה תחנה: ${firstStationLocation}`)
} else {
    assert.fail(`לא נמצאה תחנה לפי חיפוש: ${station}`)
}

mob.closeApp()
mob.pause(utils.shortWait)
