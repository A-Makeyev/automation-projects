const utils = po.utils
const homePage = po.homePage
const loginScreen = po.loginScreen

var tries = 5
function openFleetManagerLoginPage() {
    if (tries == 0) return
    else tries--

    mob.transaction(`01. Choose ${env.name} Environment`)
    po.init(env.name)

    mob.transaction(`02. Login With Phone Number -> ${env.phoneNumber}`)
    loginScreen.loginWithPhoneNumber(env.phoneNumber, env.otpNumber)

    mob.transaction('03. Open Menu')
    utils.click(homePage.menuButton)

    mob.transaction('04. Log In As Vehicle Fleet Manager')
    if (mob.isVisible('//android.widget.TextView[@text="אודות"]')) {
        mob.scrollIntoElement(
            '//android.widget.TextView[@text="אודות"]',
            '//android.widget.TextView[@text="כניסה למנהל צי רכב"]',
            0, -1000
        )
    }
    utils.click('text=כניסה למנהל צי רכב')
    if (mob.isVisible('//*[contains(@text, "Chrome notifications")]', utils.longWait)) {
        utils.click('//*[contains(@text, "No thanks")]')
    }
    mob.pause(utils.shortWait)
}
openFleetManagerLoginPage()

mob.transaction('05. Assert Redirection to External Login Page')
if (mob.isVisible('text=Not Found', utils.longWait)) {
    log.info('Page Opens With HTTP Error 404. The requested resource is not found')
    mob.resetApp()
    mob.pause(utils.shortWait)
    openFleetManagerLoginPage()
}

mob.pause(utils.longWait)
assert.equal(mob.isVisible('text=כניסה ללקוחות עסקיים'), true, 'לא הועבר למסך כניסה ללקוחות עסקיים בדפדפן')
assert.equal(mob.isVisible('text=שם משתמש'), true, 'לא מופיע שדה שם משתמש')
assert.equal(mob.isVisible('text=סיסמא'), true, 'לא מופיע שדה סיסמא')
assert.equal(mob.isVisible('text=כניסה'), true, 'לא מופיע כפתור כניסה')

mob.closeApp()
mob.pause(utils.shortWait)
