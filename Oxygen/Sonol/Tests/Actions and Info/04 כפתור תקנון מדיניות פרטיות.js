const utils = po.utils
const homePage = po.homePage
const loginScreen = po.loginScreen

mob.transaction(`01. Choose ${env.name} Environment`)
po.init(env.name)

mob.transaction(`02. Login With Phone Number -> ${env.phoneNumber}`)
loginScreen.loginWithPhoneNumber(env.phoneNumber, env.otpNumber)

mob.transaction('03. Open Actions And Info')
utils.click(homePage.actionsAndInfoButton)

mob.transaction('04. Open Regulations And Privacy Policy Section')
utils.click('text=תקנון ומדיניות פרטיות')

if (mob.isVisible('//*[contains(@text, "Chrome notifications")]', utils.longWait * 2)) {
    utils.click('//*[contains(@text, "No thanks")]')
}

assert.equal(
    mob.isVisible('text=תקנון האפליקציה'), true,
    'לא נפתח עמוד תקנון האפליקציה'
)

mob.closeApp()
mob.pause(utils.shortWait)
