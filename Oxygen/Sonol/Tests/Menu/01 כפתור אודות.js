const utils = po.utils
const homePage = po.homePage
const loginScreen = po.loginScreen

mob.transaction(`01. Choose ${env.name} Environment`)
po.init(env.name)

mob.transaction(`02. Login With Phone Number -> ${env.phoneNumber}`)
loginScreen.loginWithPhoneNumber(env.phoneNumber, env.otpNumber)

mob.transaction('03. Open Menu')
utils.click(homePage.menuButton)

mob.transaction('04. Open About Section')
utils.click('text=אודות')
assert.equal(
    mob.isVisible('text=קצת עלינו'), true,
    'עמוד אודות לא נפתח'
)

mob.closeApp()
mob.pause(utils.shortWait)
