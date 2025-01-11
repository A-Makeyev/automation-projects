const utils = po.utils
const general = po.general
const homePage = po.homePage
const actions = po.actionsAndInfo
const loginScreen = po.loginScreen

mob.transaction(`01. Choose ${env.name} Environment`)
po.init(env.name)

mob.transaction(`02. Login With Phone Number -> ${env.phoneNumber}`)
loginScreen.loginWithPhoneNumber(env.phoneNumber, env.otpNumber)

mob.transaction('03. Open Actions And Info')
utils.click(homePage.actionsAndInfoButton)

mob.transaction('04. Open How It Works Section')
utils.click(actions.howItWorksButton)
utils.click(general.nextButton)
utils.click(general.finishButton)

mob.closeApp()
mob.pause(utils.shortWait)
