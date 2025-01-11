const utils = po.utils
const homePage = po.homePage
const loginScreen = po.loginScreen

mob.transaction(`01. Choose ${env.name} Environment`)
po.init(env.name)

mob.transaction(`02. Login With Phone Number -> ${env.phoneNumber}`)
loginScreen.loginWithPhoneNumber(env.phoneNumber, env.otpNumber)

mob.transaction('03. Open Actions And Info')
utils.click(homePage.actionsAndInfoButton)

mob.transaction('04. Open Get In Touch Screen')
utils.click('text=צור קשר')

mob.transaction('05. Assert Error Message When Sending Empty Form')
if (mob.isVisible('text=נושא הפנייה')) {
    utils.click('//android.widget.Button[@content-desc="אימייל"]')
    assert.equal(
        mob.isVisible('text=*יש לבחור את נושא הפניה'), true,
        'לא הופיע טקסט לבחור נושא פניה לאחר לחיצה על כפתור אימייל'
    )
} else {
    assert.fail('מסך נושא הפנייה לא נפתח')
}

mob.transaction('06. Choose Subject')
mob.click('text=נושא הפנייה')
mob.click('text=תדלוק ותשלום')

mob.transaction('07. Send Form')
utils.click('//android.widget.Button[@content-desc="אימייל"]')

mob.transaction('08. Assert Redirection To User\'s Email')
if (mob.isVisible('//*[contains(@text, "Gmail")]') || mob.isVisible('text=תדלוק ותשלום')) {
    log.info('Screen Was Successfully Redirected To The User\'s Email')
} else {
    assert.fail('Screen Was Not Redirected To The User\'s Email')
}

mob.closeApp()
mob.pause(utils.shortWait)
