po.init(env.url, 60)

const leads = po.leads
const func = po.functions
const main = po.alphaMainPage

const phone = func.generatePhone()
const email = func.generateEmail()
const firstName = func.generateName()
const customerId = func.createTzNumber()
const lastName = `Automation - ${Math.random().toString().slice(2, 8)}`

web.transaction('04. Close All Previous Tabs')
main.closeAllTabs()

web.transaction('05. Navigate To Leads')
main.openLeads()
web.waitForVisible('//a[@title="לידים"]')

web.transaction('06. Open New Lead Page')
main.closeAllTabs()
main.openLeads()
leads.openNewLeadWindow()

web.transaction('07. Fill Lead Details')
if (!web.isVisible(leads.firstName, po.shortWait)) {
    main.closeAllTabs()
    main.openLeads()

    if (web.isVisible(leads.newLeadBtn, po.shortWait)) po.click(leads.newLeadBtn)
    else po.click(leads.createNewLead)

    leads.assertLeadWindowError()
    web.waitForVisible('//strong[contains(text(), "פרטי הליד")]')
}

po.type(leads.firstName, firstName)
po.type(leads.lastName, lastName)
po.type(leads.phone, phone) 
func.pressTAB()

leads.handlePhoneError()

if (!web.isVisible('//input[@data-value="YES"]', po.shortWait)) {
    po.click(leads.handlingCompanyBtn)
    if (web.isVisible(leads.handlingCompany.yes)) {
        po.click(leads.handlingCompany.yes)
    }   
}

po.click(leads.interestedInBtn)
po.click(leads.interestedIn.yes)

if (web.isVisible(leads.customerConfirm, po.shortWait)) 
    po.click(leads.customerConfirm)


web.transaction('08. Create Lead')
web.waitForVisible(leads.finishLead)

web.execute(() => {
    document.evaluate(
        '//span[contains(text(), "סיום")]', document,
        null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
    ).singleNodeValue.click()
})

if (web.isVisible('//span[contains(text(), "התרחשה שגיאה")]', po.shortWait * 3)) {
    assert.fail('התרחשה שגיאה ביצירת ליד חדש')
}

web.transaction('09. Update Lead')
po.type(leads.offerGiven, 'yes ultimate')
func.pressTAB()

po.type(leads.offerTextArea, 'אחלה הצעה בסך הכל')

po.click(leads.status.interested)
web.clickHidden(leads.rivalCompanies.hot)

po.type(leads.emailInput, email)
po.type(leads.idInput, customerId)
func.pressTAB()

web.transaction('10. Find Customer')
po.click(leads.findCustomersBtn)

if (!web.isVisible('//button[text()="' + main.customerName + '"]', po.shortWait * 2)) {
    if (web.isVisible('//*[contains(text(), "קיימת הזמנה פתוחה למספר זיהוי")]', po.shortWait)) {
        po.click('//*[contains(text(), "סגירת ליד")]//..//*[@class="slds-radio_faux"]')
        po.click(leads.finishUpdateLead)
        assert.equal(
            web.isVisible('//*[@data-refid="tab-name" and @title="הסתיים"]'), true,
            'ליד עם תז ' + customerId + ' לא הסתיים בהצלחה'
        )
    }

    // יצירת חשבון חיוב חדש
    log.warn('לא נמצאו תוצאות ללקוח עם תז: ' + customerId)

    po.click('//*[contains(text(), "יצירת חשבון חיוב חדש")]//..//..//..//*[@class="slds-radio_faux"]')
    po.click(leads.finishUpdateLead)

    // if (web.isVisible('//*[@data-component-id="leadStatusUpdate"]//div[@class="spinner"]')) {
    //     assert.fail(`המערכת נתקעת בזמן יצירת חשבון חיוב חדש (${web.getUrl()})`)
    // }

    web.waitForVisible('//lightning-layout-item[@title="תהליך מכר"]')

    po.type('//label[contains(text(), "עיר")]//..//input', 'כפר סבא')
    po.click('//span[@role="option"]//span[contains(text(), "כפר סבא")]')

    po.type('//label[contains(text(), "רחוב")]//..//input', 'היוזמה')
    po.click('//span[@role="option"]//span[contains(text(), "היוזמה")]')

    po.type('//label[contains(text(), "מספר בית")]//..//input', '6')
    po.click('//span[contains(text(), "פרטי כתובות לקוח")]//..//..//..//..//..//span[@class="slds-radio_faux"]//..//span[contains(text(), "בניין")]')
    po.type('//label[contains(text(), "מספר דירה")]//..//input', '1') 
    po.type('//label[contains(text(), "כניסה")]//..//input', 'ללא כניסה')

    po.click('//lightning-layout-item[@title="תהליך מכר"]//..//..//..//..//..//..//..//..//..//..//*[(text()="הבא")]')
    if (web.isVisible('//*[contains(text(), "קיים לקוח AC  בכתובת")]', po.shortWait * 2)) {
        log.warn('כבר קיים לקוח בכתובת הזאת עם תז: ' + customerId)
    }

    web.pause(1) // CREATE NEW ADDRESS OR DELETE CUSTOMER

} else {
    po.click(`//button[text()="${main.customerName}"]//..//..//..//span[@class="slds-radio_faux"]`)
}

web.transaction('11. Finish Update Lead')
po.click(leads.finishUpdateLead)
func.refresh()

web.transaction('12. Assert Created Lead')
web.waitForExist(
    `//*[@data-component-id="force_highlightsPanel"]//lightning-formatted-name[text()="${firstName} ${lastName}"]`
)

// assert.equal(
//     web.isVisible(
//         `//*[@data-component-id="force_highlightsPanel"]//lightning-formatted-name[text()="${firstName} ${lastName}"]`
//     ), true, `${firstName} ${lastName} was not found`
// )

// assert.equal(
//     web.isVisible(
//         '//span[text()="שלב טיפול בליד"]//..//..//lightning-formatted-text[text()="הסתיים"]'
//     ), true, 'התהליך לא הסתיים בהצלחה'
// )

// assert.equal(
//     web.isVisible(
//         '//span[text()="סטטוס עסקי ליד"]//..//..//lightning-formatted-text[text()="הומר בהצלחה"]'
//     ), true, 'התהליך לא הומר בהצלחה'
// )
