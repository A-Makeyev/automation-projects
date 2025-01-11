const utils = po.utils
const homePage = po.homePage
const loginScreen = po.loginScreen
const profilePage = po.profilePage

mob.transaction(`01. Choose ${env.name} Environment`)
po.init(env.name)

mob.transaction(`02. Login With Phone Number -> ${env.phoneNumber}`)
loginScreen.loginWithPhoneNumber(env.phoneNumber, env.otpNumber)

mob.transaction('03. Open Profile')
utils.click(homePage.profileButton)

mob.transaction('04. Assert Profile Details')
if (mob.isVisible(profilePage.fullName) && mob.isVisible(profilePage.level) && mob.isVisible(profilePage.goods)) {
    let fullName = mob.getText(profilePage.fullName)
    let level = mob.getText(profilePage.level)
    let goods = mob.getText(profilePage.goods)
    log.info(`שם משתמש: ${fullName}`)
    log.info(level)
    log.info(goods)
} else {
    assert.fail('לא מופיע שם מלא של המשתמש')
}

if (mob.isVisible(profilePage.fullName)) {
    let gender = mob.getText(profilePage.gender)
    log.info(`מין המשתמש: ${gender}`)
} else {
    assert.fail('לא מופיע מין המשתמש')
}

if (mob.isVisible(`//android.view.View[@text="${env.carNumber}"]`) && mob.isVisible('//android.widget.TextView[@text="גולד 95"]')) {
    log.info(`מספר רכב: ${env.carNumber} וסוג דלק: ${env.gasType}`)
} else {
    assert.fail(`לא מופיע מספר רכב ${env.carNumber} וסוג דלק ${env.gasType}`)
}

assert.equal(mob.isVisible(profilePage.editCarButton(env.carNumber)), true, 'לא מופיע כפתור לעריכת פרטי רכב')
assert.equal(mob.isVisible(profilePage.deleteCarButton(env.carNumber)), true, 'לא מופיע כפתור למחיקת רכב')

mob.closeApp()
mob.pause(utils.shortWait)
