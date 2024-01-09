// in gmail, allow less secure apps & enable imap
// https://myaccount.google.com/u/2/lesssecureapps

var assertEmail = true
var date_12_daysAgo = new Date()
date_12_daysAgo.setDate(date_12_daysAgo.getDate() - 12)

var pastDay = po.formatDate(date_12_daysAgo).slice(0, 2)
if (pastDay.charAt(0) == '0') pastDay = pastDay.slice(1)

var formattedDate = po.formatDate(date_12_daysAgo)
log.info('תאריך לפני 12 ימים: ' + formattedDate)

function chooseOption(element, option) {
    po.type(element, option)
    web.pause(po.waitASecond)
    po.pressARROW_DOWN()
    po.pressENTER()
}

web.transaction('01. Initialize')
web.init()
web.setTimeout(30 * po.waitASecond)

web.transaction('02. Open Quarantine Report Page')
web.open('https://govforms.gov.il/mw/forms/QuarantineForExposees@health.gov.il')
web.waitForExist('//div[@class="main-container"]')

web.transaction('03. Open Form')
if (web.isVisible('id=btnEntrance', po.shortWait)) {
    po.click('id=btnEntrance')
}

web.transaction('03. Enter Personal Details')
chooseOption('id=ReporterType', 'אדם פרטי')
po.click('//span[@data-bind="text:labels().meOnly"]')
po.click('//*[@id="nextTab"]')

po.type('id=Phone1', po.phoneNumber)
po.type('id=Email', po.emailAddress)
po.type('id=IdentityNumber', po.ID)
po.type('id=FirstName', po.firstName)
po.type('id=LastName', po.lastName)

po.click('//*[@name="Fever0"]//..//span[@data-bind="text:labels().no"]')

web.transaction('04. Enter Quarantine Details')
po.click('//*[@id="nextTab"]')

po.type('id=ExposeeDate', formattedDate)
while (web.isVisible('id=vmsg_ExposeeDate', po.shortWait)) {
    po.type('id=ExposeeDate', formattedDate)
    web.pause(po.waitASecond)
}

po.type('id=enteringIsolationDate', formattedDate)

chooseOption('id=ExposeeCity', 'ירושלים')
chooseOption('id=QuarantineReason', 'מגן')
po.type('id=OtherExposureDetails', 'בדיקת ניטור סינתטי למערכת ~ תשתיות מחשוב משרד הבריאות')

web.transaction('05. Enter Address Details')
po.click('//*[@id="nextTab"]')

chooseOption('id=City', 'ירושלים')
chooseOption('id=Street', 'ירמיהו')
po.type('id=BuildingNumber', '80')

web.transaction('06. Submit Form')
po.click('id=sendBtn')

web.transaction('07. Assert That The Form Was Sent Successfully')
assert.equal(
    web.isVisible(
        '//span[@class="ui-dialog-title" and contains(text(), "הטופס נשלח בהצלחה")]'
    ), true, 'התרחשה שגיאה באת שליחת הטופס'
)

assert.contain(
    po.getText('//span[@class="ui-dialog-title"]'), 
    'הטופס נשלח בהצלחה', 'התרחשה שגיאה באת שליחת הטופס'
)

var referenceNumber = po.getText('(//div[@id="messageDialog"]//span)[1]')
referenceNumber = referenceNumber.split(':')[1].trim().match(/\d+/g)

log.info('מספר סימוכין: ' + referenceNumber)

web.transaction('08. Assert That Correct Details Were Sent To Email')
if (web.isVisible('//span[@class="ui-dialog-title" and contains(text(), "הטופס נשלח בהצלחה")]', po.shortWait)) {
    if (assertEmail) {
        email.init(
            po.emailAddress, po.emailPassword,                         
            'imap.gmail.com', 993, true, 9000                                
        )

        let mail = email.getLastEmail(90, `דיווח עצמי על בידוד בית – מגע עם חולה  ${referenceNumber}`, 90 * po.waitASecond)                                       
        log.info('Email Subject: ' + mail.subject)
        log.info('Email Date: ' + mail.date)

        let buffer = new Buffer(mail.body, 'base64')
        // require('fs').writeFileSync('C:\\Users\\Makeyev\\Desktop\\mailbody.txt', buffer)

        let mailBody = buffer.toString()

        if (!mailBody.includes(`${firstName} שלום`)) {
            assert.fail(`${firstName} לא מופיע במייל`)
        }
    }
} else {
    assert.fail('הייתה תקלה בעת שליחת הטופס')
}
