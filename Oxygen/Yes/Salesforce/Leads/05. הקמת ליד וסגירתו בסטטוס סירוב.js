po.init(env.url, 60)

const leads = po.leads
const func = po.functions
const main = po.alphaMainPage

const phone = func.generatePhone()
const firstName = func.generateName()
const lastName = `Automation - ${Math.random().toString().slice(2, 8)}`

web.transaction('04. Close All Previous Tabs')
main.closeAllTabs()

web.transaction('05. Navigate To Leads')
main.openLeads()
assert.equal(web.isVisible('//a[@title="לידים"]'), true)

web.transaction('06. Open New Lead Page')
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

po.click(leads.status.denial)
web.clickHidden(leads.reason.price)
web.clickHidden(leads.rivalCompanies.hot)

web.transaction('10. Finish Update Lead')
po.click(leads.finishUpdateLead)

web.transaction('11. Assert Created Lead')
assert.equal(
    web.isVisible(`//*[@data-component-id="force_highlightsPanel"]//lightning-formatted-name[text()="${firstName} ${lastName}"]`), true,
    `The lead for ${firstName} ${lastName} was not created`
)

assert.equal(
    web.isVisible('//span[contains(text(), "סטטוס עסקי ליד")]//..//..//*[@data-output-element-id="output-field" and contains(text(), "סירוב")]'), true,
    `The lead for ${firstName} ${lastName} was not closed with status cancelled`
)
