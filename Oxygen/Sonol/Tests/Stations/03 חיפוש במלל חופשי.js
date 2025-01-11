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

mob.transaction('04. Search Station With Full Name')
let fullStationName = 'קניון עזריאלי'
mob.type(stationsPage.searchInput, fullStationName)

if (mob.isVisible(stationsPage.firstStation)) {
    let firstStationLocation = mob.getText(`(${stationsPage.firstStation}//..//android.widget.TextView[contains(@text, "${fullStationName}")])[1]`)
    log.info(`נמצאה התחנה ${firstStationLocation} :בעזרת חיפוש עם ${fullStationName}`)
} else {
    assert.fail(`לא נמצאה תחנה לפי חיפוש: ${fullStationName}`)
}

mob.transaction('05. Search Station With Half Name')
let halfStationName = fullStationName.split(' ')[1]
mob.type(stationsPage.searchInput, halfStationName)

if (mob.isVisible(stationsPage.firstStation)) {
    let firstStationLocation = mob.getText(`(${stationsPage.firstStation}//..//android.widget.TextView[contains(@text, "${halfStationName}")])[1]`)
    log.info(`נמצאה התחנה ${firstStationLocation} :בעזרת חיפוש עם ${halfStationName}`)
} else {
    assert.fail(`לא נמצאה תחנה לפי חיפוש: ${halfStationName}`)
}

mob.transaction('06. Search Station With Full Location')
let fullStationLocation = 'תל אביב'
mob.type(stationsPage.searchInput, fullStationLocation)

if (mob.isVisible(stationsPage.firstStation)) {
    let firstStationLocation = mob.getText(`(${stationsPage.firstStation}//..//android.widget.TextView[contains(@text, "${fullStationLocation}")])[1]`)
    log.info(`נמצאה התחנה ${firstStationLocation} :בעזרת חיפוש עם ${fullStationLocation}`)
} else {
    assert.fail(`לא נמצאה תחנה לפי חיפוש: ${fullStationLocation}`)
}

mob.transaction('07. Search Station With Half Location')
let halfStationLocation = fullStationLocation.split(' ')[1]
mob.type(stationsPage.searchInput, halfStationLocation)

if (mob.isVisible(stationsPage.firstStation)) {
    let firstStationLocation = mob.getText(`(${stationsPage.firstStation}//..//android.widget.TextView[contains(@text, "${halfStationLocation}")])[1]`)
    log.info(`נמצאה התחנה ${firstStationLocation} :בעזרת חיפוש עם ${halfStationLocation}`)
} else {
    assert.fail(`לא נמצאה תחנה לפי חיפוש: ${halfStationLocation}`)
}

mob.closeApp()
mob.pause(utils.shortWait)
