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

let currentName = mob.getText(profilePage.fullName)
log.info('שם נוכחי: ' + currentName)

let currentGender = mob.getText(profilePage.gender)
log.info(`מין המשתמש הנוכחי: ${currentGender}`)

let currentEmail = mob.getText(profilePage.email)
log.info(currentEmail !== '' ? `אימייל נוכחי: ${currentEmail}` : 'אימייל ריק')

mob.transaction('04. Open User Edit Screen')
utils.click(profilePage.editDetailsButton)

mob.transaction('05. Assert Wrong Email Error Message')
mob.clear(profilePage.editEmailInput)
mob.type(profilePage.editEmailInput, 'anatoly')
utils.click(profilePage.acceptButton)

assert.equal(
    mob.isVisible('text=*מייל לא תקין'), true,
    'לא הופיע הודעת שגיאה על מייל לא תקין'
)

mob.transaction('06. Update Email')
utils.click(profilePage.cancelButton)
utils.click(profilePage.editDetailsButton)

mob.clear(profilePage.editEmailInput)
mob.type(profilePage.editEmailInput, 'anatoly.makeyev@cloudbeat.io')

mob.transaction('07. Edit Full Name')
let newName = utils.randomName(10)
let changeNameTries = 0
while (newName == currentName) {
    newName = utils.randomName(10)
    if (changeNameTries == 10) break
    else changeNameTries++
}
log.info('שם חדש: ' + utils.randomName(10))

mob.clear(profilePage.editFullNameInput)
mob.type(profilePage.editFullNameInput, newName)

mob.transaction('08. Edit Gender')
let newGender

if (mob.isVisible('//android.view.ViewGroup[@content-desc="לא מוגדר לא נבחר. בחירה, 3 מתוך 3"]', utils.shortWait)) {
    utils.click('text=לא מוגדר')
    newGender = 'לא מוגדר'
} else if (mob.isVisible('//android.view.ViewGroup[@content-desc="נקבה לא נבחר. בחירה, 2 מתוך 3"]', utils.shortWait)) {
    utils.click('text=נקבה')
    newGender = 'נקבה'
} else if (mob.isVisible('//android.view.ViewGroup[@content-desc="זכר לא נבחר. בחירה, 1 מתוך 3"]', utils.shortWait)) {
    utils.click('text=זכר')
    newGender = 'זכר'
}

log.info(`מין המשתמש חדש: ${newGender}`)

mob.transaction('09. Save New Details')
utils.click(profilePage.acceptButton)
mob.pause(utils.shortWait)

mob.transaction('10. Assert Changes')
let updatedName = mob.getText(profilePage.fullName)
let updatedGender = mob.getText(profilePage.gender)

if (updatedName == newName) {
    log.info('שם מעודכן: ' + updatedName)
} else {
    assert.fail(`Expected updated name to be: ${newName}, instead got: ${updatedName}`)
}

if (updatedGender == newGender) {
    log.info(`מין המשתמש מעודכן: ${updatedGender}`)
} else {
    assert.fail(`Expected updated gender to be: ${newGender}, instead got: ${updatedGender}`)
}

mob.closeApp()
mob.pause(utils.shortWait)
