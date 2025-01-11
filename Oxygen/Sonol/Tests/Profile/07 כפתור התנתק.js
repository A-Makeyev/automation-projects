const utils = po.utils
const homePage = po.homePage
const loginScreen = po.loginScreen

mob.transaction(`01. Choose ${env.name} Environment`)
po.init(env.name)

mob.transaction(`02. Login With Phone Number -> ${env.phoneNumber}`)
loginScreen.loginWithPhoneNumber(env.phoneNumber, env.otpNumber)

mob.transaction('03. Open Menu')
utils.click(homePage.menuButton)

mob.transaction('04. Log Out')
if (mob.isVisible('//android.widget.TextView[@text="אודות"]')) {
    mob.scrollIntoElement(
        '//android.widget.TextView[@text="אודות"]',
        '//android.widget.TextView[@text="התנתק"]',
        0, -1000
    )
}

utils.click('text=התנתק')
mob.pause(utils.shortWait)

if (mob.isVisible('text=התנתקות')) {
    utils.click('text=לא, חזרה')
    assert.equal(
        mob.isVisible('//android.widget.Button[@content-desc="עמוד פרופיל"]'), true,
        'המשתמש התנתק למרות שנלחץ לא, חזרה'
    )
}

mob.transaction('05. Assert Redirection to Login Screen')
utils.click('text=התנתק')
mob.pause(utils.shortWait)
utils.click('text=כן, להתראות')
mob.pause(utils.shortWait)
assert.equal(
    mob.isVisible(loginScreen.phoneInput), true,
    'המשתמש לא הועבר למסך התחברות'
)

mob.closeApp()
mob.pause(utils.shortWait)
