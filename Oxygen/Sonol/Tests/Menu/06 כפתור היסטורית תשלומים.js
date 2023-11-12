const utils = po.utils
const homePage = po.homePage
const loginScreen = po.loginScreen

mob.transaction(`01. Choose ${env.name} Environment`)
po.init(env.name)

mob.transaction(`02. Login With Phone Number -> ${env.phoneNumber}`)
loginScreen.loginWithPhoneNumber(env.phoneNumber, env.otpNumber)

mob.transaction('03. Open Menu')
utils.click(homePage.menuButton)

mob.transaction('04. Open Payment History Section')
if (mob.isVisible('//android.widget.TextView[@text="אודות"]')) {
    mob.scrollIntoElement(
        '//android.widget.TextView[@text="אודות"]',
        '//android.widget.TextView[@text="נגישות"]',
        0, -1000
    )
}

utils.click('text=היסטוריית תשלומים')

if (mob.isVisible('text=עוד לא ביצעת שום רכישה!')) {
    log.info('עוד לא ביצעת שום רכישה!')
}

mob.closeApp()
mob.pause(utils.shortWait)
