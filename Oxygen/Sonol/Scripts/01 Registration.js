const utils = po.utils
const loginScreen = po.loginScreen
const phoneNumber = '9999999999'

po.init(env.name)
utils.getAppSource()

mob.transaction('03. Type Phone Number')
loginScreen.enterNumber(phoneNumber)

mob.transaction('04. Continue To Send OTP')
utils.click(loginScreen.continueButton)
mob.waitForVisible(`//android.widget.TextView[@text="הקוד נשלח אל  ${phoneNumber}"]`)

mob.transaction('05. Type OTP')
loginScreen.enterNumber('1234')

mob.transaction('06. Continue')
utils.click(loginScreen.continueButton)

if (mob.isVisible('//android.widget.TextView[@text="שדות המסומנים בכוכבית הינם שדות חובה"]', utils.longWait)) {
    mob.transaction('06.01. Type Personal Details')
    mob.type('//android.widget.EditText[contains(@text, "שם פרטי")]', 'אנטולי')
    mob.type('//android.widget.EditText[contains(@text, "שם משפחה")]', 'מקייב')
    mob.type('//android.widget.EditText[contains(@text, "מייל")]', 'anatoly.makeyev@cloudbeat.io')
    mob.type('//android.widget.EditText[contains(@text, "מספר רכב")]', '6666666')

    mob.scrollIntoElement(
        '//android.widget.TextView[@text="סוג דלק"]',
        '//android.widget.Button[contains(@content-desc,"סיום")]/android.view.ViewGroup',
        0, -500
    )

    utils.click('//android.widget.TextView[contains(@text, "יש לבחור סוג דלק")]')
    utils.click('//android.widget.Button[@content-desc=" גולד 95"]')
    utils.click('(//android.widget.Button[@content-desc=" גולד 95"]//..//android.widget.ImageView)[1]')
    utils.click('//android.widget.TextView[contains(@text, "יש לי דלקן")]//..//android.widget.TextView[@text="לא"]')
    utils.click('//android.widget.TextView[@text="זכר"]')
    utils.click('//android.view.ViewGroup[@content-desc="בחירה undefined  לא נבחר"]') // מאשר/ת בזאת את תנאי השימוש

    mob.transaction('06.02. Finish Form')
    utils.click('//android.widget.Button[contains(@content-desc,"סיום")]/android.view.ViewGroup')
    if (mob.isVisible('//android.widget.TextView[contains(@text, "נרשמתם בהצלחה")]', utils.longWait)) {
        utils.click('//android.widget.Button[contains(@content-desc, "איזה כיף לי")]')
        log.info('נרשמתם בהצלחה')
    }
} 

mob.pause(utils.shortWait)
if (mob.isVisible('//android.widget.Button/android.widget.TextView[@text="הבא"]')) {
    utils.click('//android.widget.Button/android.widget.TextView[@text="הבא"]')
    utils.click('//android.widget.Button/android.widget.TextView[@text="הבא"]')
    utils.click('//android.widget.Button/android.widget.TextView[@text="סיום"]')
}

mob.pause(utils.shortWait)
if (mob.isVisible(`//android.widget.TextView[contains(@text, "בוקר טוב, אנטולי")]`, utils.longWait)) {
    utils.click('(//android.widget.Button[contains(@content-desc, "חנות נוחות")]//..//android.view.ViewGroup)[1]')

    mob.scrollIntoElement(
        '//android.widget.TextView[@text="אודות"]',
        '//android.widget.TextView[@text="מחיקת חשבון"]',
        0, -1000
    )

    utils.click('//android.widget.TextView[@text="מחיקת חשבון"]')
    utils.click('//android.widget.TextView[contains(@text, "ברצונכם למחוק את החשבון")]//..//android.widget.TextView[@text="כן"] ')
    log.info(`User with phone number "${phoneNumber}" already exists`)
    log.info(`User with phone number "${phoneNumber}" was deleted`)
    assert.pass()
}

mob.pause(utils.shortWait)
if (mob.isVisible('//android.widget.TextView[contains(@text, "פרטי האשראי")]', utils.longWait)) {
    utils.click('//android.widget.Button[contains(@content-desc, "הוספת כרטיס חדש - ידני")]')
    utils.click('//android.widget.TextView[contains(@text, "קוד אישי")]')

    mob.type('(//android.widget.TextView[contains(@text, "הקלידו סיסמה")]//..//android.widget.EditText)[1]', '1')
    mob.type('(//android.widget.TextView[contains(@text, "הקלידו סיסמה")]//..//android.widget.EditText)[2]', '2')
    mob.type('(//android.widget.TextView[contains(@text, "הקלידו סיסמה")]//..//android.widget.EditText)[3]', '3')
    mob.type('(//android.widget.TextView[contains(@text, "הקלידו סיסמה")]//..//android.widget.EditText)[4]', '4')

    if (mob.isVisible('//android.widget.TextView[contains(@text, "הזינו קוד אישי בשנית")]')) {
        mob.type('(//android.widget.TextView[contains(@text, "הקלידו סיסמה")]//..//android.widget.EditText)[1]', '1')
        mob.type('(//android.widget.TextView[contains(@text, "הקלידו סיסמה")]//..//android.widget.EditText)[2]', '2')
        mob.type('(//android.widget.TextView[contains(@text, "הקלידו סיסמה")]//..//android.widget.EditText)[3]', '3')
        mob.type('(//android.widget.TextView[contains(@text, "הקלידו סיסמה")]//..//android.widget.EditText)[4]', '4')
    }
}

mob.pause(utils.shortWait)
if (mob.isVisible('//android.widget.TextView[contains(@text, "הסיסמה עודכנה בהצלחה")]', utils.longWait)) {
    utils.click('//android.widget.TextView[contains(@text, "אישור")]')

    mob.type('//android.widget.EditText[contains(@text, "תעודת זהות")]', '000966424')
    mob.type('//android.widget.EditText[contains(@text, "כרטיס אשראי")]', '4580080113180592')
    mob.type('//android.widget.EditText[contains(@text, "תוקף")]', '0124')
    mob.type('//android.widget.EditText[contains(@text, "קוד אבטחה")]', '151')

    utils.click('//android.widget.TextView[contains(@text,"אימות אשראי")]')

    if (mob.isVisible('//android.widget.TextView[contains(@text,"הזנת קוד אימות")]', utils.longWait)) {
        mob.type('//android.widget.EditText[contains(@text, "הזנת קוד")]', '1234')
        utils.click('//android.widget.TextView[contains(@text,"אימות כרטיס אשראי")]')

        if (mob.isVisible('//android.widget.TextView[contains(@text,"קוד לא תקין")]', utils.longWait)) {
            log.info(mob.getText('//android.widget.TextView[contains(@text,"קוד לא תקין")]'))
            utils.click('//android.widget.Button[@content-desc="חזור אחורה"]')
            utils.click('//android.widget.Button[@content-desc="חזור אחורה"]')
            utils.click('//android.widget.TextView[contains(@text,"בפעם אחרת")]')
        }

    } else if (mob.isVisible('//android.widget.TextView[contains(@text,"כרטיס אינו תקין")]', utils.longWait)) {
        // utils.click('//android.widget.TextView[contains(@text,"נסיון נוסף")]')
        utils.click('//android.widget.TextView[contains(@text,"הוספת כרטיס מאוחר יותר")]')
    }
}

mob.pause(utils.shortWait)
if (mob.isVisible(loginScreen.homePageButton)) mob.click(loginScreen.homePageButton)
utils.click('(//android.widget.Button[contains(@content-desc, "חנות נוחות")]//..//android.view.ViewGroup)[1]')

mob.scrollIntoElement(
    '//android.widget.TextView[@text="אודות"]',
    '//android.widget.TextView[@text="מחיקת חשבון"]',
    0, -1000
)

utils.click('//android.widget.TextView[@text="מחיקת חשבון"]')
utils.click('//android.widget.TextView[contains(@text, "ברצונכם למחוק את החשבון")]//..//android.widget.TextView[@text="כן"] ')
log.info(`User with phone number "${phoneNumber}" was deleted`)

