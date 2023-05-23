po.init(env.url, 60)

const leads = po.leads
const func = po.functions
const main = po.alphaMainPage

const id = '266623602'
const phone = func.generatePhone()
const email = func.generateEmail()
const firstName = func.generateName()
const lastName = `Automation - ${Math.random().toString().slice(2, 8)}`

web.transaction('04. Close All Previous Tabs')
main.closeAllTabs()

web.transaction('05. Navigate To Leads')
main.openLeads()
assert.equal(web.isVisible('//a[@title="לידים"]'), true)

web.transaction('06. Open New Lead Page')
main.closeAllTabs()
leads.openNewLeadWindow()

function createLead(firstName, lastName, phone) {
    let retry = true

    web.transaction('07. Fill Lead Details')
    if (!web.isVisible(leads.firstName, po.shortWait)) {
        main.closeAllTabs()
        main.openLeads()

        leads.openNewLeadWindow()
        leads.assertLeadWindowError()

        if (!web.isVisible('//strong[contains(text(), "פרטי הליד")]')) {
            func.refresh()
            var tries = 5
            while (!web.isVisible('//strong[contains(text(), "פרטי הליד")]')) {
                func.refresh()
                tries++
                if (tries > 5) {
                    assert.fail('Page was stuck at loading...')
                }
            }
        }
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

    if (web.isVisible(leads.errorContainer)) {
        if (!retry) {
            assert.fail(web.getText(leads.errorContainer))
        }
        createLead(firstName, lastName, phone)
        retry = false
    }
}

createLead(firstName, lastName, phone)

if (web.isVisible('//span[contains(text(), "התרחשה שגיאה")]', po.shortWait)) {
    web.transaction('09. Navigate To Leads')
    po.click('//span[text()="התרחשה שגיאה:"]//..//..//..//..//a[@target="_self"]')
    main.openLeads()

    web.transaction('10. Open New Lead Page')
    main.closeAllTabs()
    leads.openNewLeadWindow()

    web.transaction('11. Create New Lead')
    createLead(firstName, lastName, phone)
}

web.transaction('12. Assert Lead')
web.waitForVisible('//span[text()="מתעניין ב"]//..//..//span[text()="yes"]')
web.waitForVisible(`//span[text()="טלפון"]//..//..//..//..//..//..//..//lightning-formatted-name[text()="${firstName} ${lastName}"]`)
