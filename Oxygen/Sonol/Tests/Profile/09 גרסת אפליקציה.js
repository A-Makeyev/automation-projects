const utils = po.utils
const homePage = po.homePage
const loginScreen = po.loginScreen

mob.transaction(`01. Choose ${env.name} Environment`)
po.init(env.name)

mob.transaction(`02. Login With Phone Number -> ${env.phoneNumber}`)
loginScreen.loginWithPhoneNumber(env.phoneNumber, env.otpNumber)

mob.transaction('03. Open Menu')
utils.click(homePage.menuButton)

mob.transaction('04. Assert That App Version is Present')
if (mob.isVisible('//android.widget.TextView[@text="אודות"]')) {
    mob.scrollIntoElement(
        '//android.widget.TextView[@text="אודות"]',
        '//android.widget.TextView[@text="התנתק"]',
        0, -1500
    )
}

if (mob.isVisible('//android.widget.TextView[contains(@text, "גירסא")]')) {
    log.info(mob.getText('//android.widget.TextView[contains(@text, "גירסא")]'))
} else {
    assert.fail('לא מופיעה גירסה בתחתית')
}

mob.closeApp()
mob.pause(utils.shortWait)
