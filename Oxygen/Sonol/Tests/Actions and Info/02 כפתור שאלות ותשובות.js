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

mob.transaction('04. Open Questions And Answers Section')
utils.click(actions.questionsAndAnswersButton)

mob.transaction('05. Assert Questions And Answers')
if (mob.isVisible('text=שאלות נפוצות')) {
    if (mob.isVisible('//android.view.ViewGroup[contains(@content-desc, "מהי מגבלת הצבירה לנקודות")]')) {
        utils.click('//android.view.ViewGroup[contains(@content-desc, "מהי מגבלת הצבירה לנקודות")]')
        assert.equal(
            mob.isVisible('//android.view.ViewGroup[contains(@content-desc, "תוגבל ל-500")]'), true,
            'לא נפתח טקסט באת לחיצה על מהי מגבלת הצבירה לנקודות'
        )

        utils.click('//android.view.ViewGroup[contains(@content-desc, "למה אני צריך להכניס אמצעי זיהוי")]')
        assert.equal(
            mob.isVisible('//android.view.ViewGroup[contains(@content-desc, "לצורך אבטחת הפרטיות שלך אנו דורשים לאמת את אמצעי הזיהוי בכל רכישה")]'), true,
            'לא נפתח טקסט באת לחיצה על מהי למה אני צריך להכניס אמצעי זיהוי'
        )

        utils.click('//android.view.ViewGroup[contains(@content-desc, "איך צוברים נקודות")]')
        assert.equal(
            mob.isVisible('//android.view.ViewGroup[contains(@content-desc, "ישנן מגוון דרכים להרוויח נקודות")]'), true,
            'לא נפתח טקסט באת לחיצה על איך צוברים נקודות'
        )
    }
} else {
    assert.fail('עמוד שאלות נפוצות לא נפתח')
}

mob.closeApp()
mob.pause(utils.shortWait)
