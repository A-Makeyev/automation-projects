const obj = po
const nav = obj.nav
const cases = obj.cases
const utils = obj.utils
const func = obj.functions
const manager = obj.ribbonManager


web.transaction('01. Initialize Selenium')
web.init()


web.transaction('02. Open Main Page As Nurse')
startTime = func.getTime()
obj.login(
    obj.users.nurse.username,
    obj.users.nurse.password,
    env.url, 30
)

web.transaction('03. Open Cases Page')
func.navigateToCases()


web.transaction('04. Open New Case')
obj.click(manager.cases.newCase)
web.selectFrame(obj.utils.frames.frame_1) // frame -> #1


web.transaction('05. Create New Case - Milk Nurse')
func.createPniya(obj.ID, 'מידע', 'טיפת חלב', 'תיאור כללי', 'down')


web.transaction('06. Assert Default Handling Team - Milk Nurse')
assert.equal(web.isVisible(cases.handlingTeamName), true)

var team = func.getText(cases.handlingTeamName)
if (team != 'אחות טיפת חלב') {
    assert.fail('צוות ברירת מחדל אינו אחות טיפת חלב')
} 

web.transaction('07. Assert Healthy Thought Status')
assert.equal(web.isVisible(cases.healthyThought), true)

obj.click(cases.healthyThought)
for (let x = 0; x < 2; x++) {
    func.pressARROW_UP()
}
func.pressENTER()

var testStatus = func.getText('//label[@id="בוצע עיון בתיק המטופל_label"]')
if (!testStatus.includes('לא')) {
    assert.fail('לא מסומן "לא" בתוך בוצע עיון בתיק המטופל כברירת מחדל')
} else {
    web.transaction('08. Save Case')
    func.savePniya()
}


web.transaction('09. Open SMS Window')
obj.click(manager.cases.sendSMS)
web.selectFrame(utils.frames.alertFrame)

var info = func.getValue(utils.smsTextArea)
log.info(info)

if (!info.includes('בהמשך לשיחתך עם מוקד טיפת חלב, קוד ההזדהות שלך הוא')) {
    assert.fail('לא מופיעה הודעה בשדה הטקסט')
} else {
    web.transaction('10. Create SMS Code')
    obj.click(utils.createSmsCode)
}

var code = func.getValue(utils.smsTextArea).trim().match(/\d+/g)
log.info('Generated SMS code: ' + code)


web.transaction('11. Send SMS')
obj.click(utils.sendSmsBtn)


web.transaction('12. Assert SMS has been sent')
assert.equal(web.isExist(utils.popUp), true)

const message = func.getText(utils.popUp)
if (!message.includes('ההודעה נשלחה ללקוח')) {
    log.info('sms לא הופיע הודעת שליחת')
}

if (web.isVisible(utils.alertJs_X)) {
    obj.click(utils.alertJs_X)
    web.selectWindow()
} else {
    web.selectWindow()
}


web.transaction('13. Open SMS Window')
obj.click(manager.cases.sendSMS)
web.pause(3000)

web.selectFrame(utils.frames.alertFrame)
obj.type(utils.smsAnotherPhone, '0505050505')

func.pressTAB()


web.transaction('14. Send New SMS')
obj.click(utils.sendSmsBtn)


web.transaction('15. Close SMS Window')
web.waitForNotExist(utils.frames.alertFrame)

web.selectWindow()
web.selectFrame(utils.frames.frame_1) // frame -> #1


web.transaction('16. Open Subject Window')
obj.click(cases.addSubjectBtn)

web.pause(2500)
web.selectFrame(utils.frames.alertFrame) // frame -> alert


web.transaction('17. Select Subjects')
obj.click(utils.consultSubjects_baby)

obj.click(utils.consultSubjects_baby_options)
obj.click('(//div[contains(@ng-controller, "treeCtrl")]//input[@ng-model="node.isSelect"])[2]')


web.transaction('18. Accept Subjects')
obj.click(utils.consultSubjects_accept)

web.pause(2500)
web.selectWindow()
web.selectFrame(utils.frames.frame_1) // frame -> #1
web.pause(2500)


web.transaction('19. Assert Created Subject')
if (web.isExist(`(${utils.consultSubjects_result})[1]`)) {
    assert.equal(web.isVisible(`(${utils.consultSubjects_result})[1]`), true)
    assert.equal(web.isVisible(`(${utils.consultSubjects_result})[2]`), true)

    let subject = func.getText(`(${utils.consultSubjects_result})[1]`)
    log.info('Subject: ' + subject)

    if (subject.includes('תינוק/פעוט')) {
        if (web.isExist(`(${utils.consultSubjects_result})[2]`)) {
            let subSubject = func.getText(`(${utils.consultSubjects_result})[2]`)
            log.info('Sub Subject: ' + subSubject)

            if (subSubject.includes('תופעות לוואי לאחר חיסון')) {
                web.transaction('20. Resolve Case')
                func.resolve('Success')
            }
        }
    }
}


web.dispose('Passed')
endTime = func.getTime()
log.info(`Test finished in: ${parseFloat((endTime - startTime) / 1000).toFixed(1)} seconds.`)