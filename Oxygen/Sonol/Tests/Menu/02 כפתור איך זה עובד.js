const utils = po.utils
const homePage = po.homePage
const loginScreen = po.loginScreen

mob.transaction(`01. Choose ${env.name} Environment`)
po.init(env.name)

mob.transaction(`02. Login With Phone Number -> ${env.phoneNumber}`)
loginScreen.loginWithPhoneNumber(env.phoneNumber, env.otpNumber)

mob.transaction('03. Open Menu')
utils.click(homePage.menuButton)

mob.transaction('04. Open How It Works Section')
utils.click('text=איך זה עובד?')

if (mob.isVisible('text=מתדלקים בקליק') || mob.isVisible(loginScreen.nextButton)) {
    utils.click(loginScreen.nextButton)
    if (mob.isVisible('text=צוברים נקודות') || mob.isVisible(loginScreen.goToHomePageButton)) {
        utils.click(loginScreen.goToHomePageButton)

        if (mob.isVisible('text=הצטרפות', utils.shortWait)) {
            assert.equal(mob.isVisible('text=הצטרפות'), true, 'אופציה (הצטרפות) לא מופיעה')
            assert.equal(mob.isVisible('text=נקודות בונוס'), true, 'אופציה (נקודות בונוס) לא מופיעה')
            assert.equal(mob.isVisible('text=חיבור אשראי'), true, 'אופציה (חיבור אשראי) לא מופיעה')
            assert.equal(mob.isVisible('text=ליטר במשאבה'), true, 'אופציה (ליטר במשאהב) לא מופיעה')
            assert.equal(mob.isVisible('text=הטבות בלעדיות'), true, 'אופציה (הטבות בלעדיות) לא מופיעה')
            assert.equal(mob.isVisible('text=שקל בSogoods'), true, 'אופציה (שקל בSogoods) לא מופיעה')
        }

        mob.transaction('05. Close And Go Back To Menu')
        utils.click(homePage.finishButton)
        assert.equal(
            mob.isVisible('text=איך זה עובד?'), true,
            'לא הועבר בחזרה לתפריט לאחר סיום'
        )
    }
} else {
    assert.fail('עמוד איך זה עובד לא נפתח')
}

mob.closeApp()
mob.pause(utils.shortWait)
