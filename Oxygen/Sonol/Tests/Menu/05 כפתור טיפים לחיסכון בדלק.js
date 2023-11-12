const utils = po.utils
const homePage = po.homePage
const loginScreen = po.loginScreen

mob.transaction(`01. Choose ${env.name} Environment`)
po.init(env.name)

mob.transaction(`02. Login With Phone Number -> ${env.phoneNumber}`)
loginScreen.loginWithPhoneNumber(env.phoneNumber, env.otpNumber)

mob.transaction('03. Open Menu')
utils.click(homePage.menuButton)

mob.transaction('04. Open Fuel Saving Tips Section')
if (mob.isVisible('//android.widget.TextView[@text="אודות"]')) {
    mob.scrollIntoElement(
        '//android.widget.TextView[@text="אודות"]',
        '//android.widget.TextView[@text="טיפים לחסכון בדלק"]',
        0, -500
    )
}

utils.click('text=טיפים לחסכון בדלק')
assert.equal(
    mob.isVisible('text=טיפים לנהיגה עירונית חסכונית'), true,
    'לא נפתח עמוד טיפים לחסכון בדלק'
)

mob.closeApp()
mob.pause(utils.shortWait)
