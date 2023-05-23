const obj = po
obj.init(env.url, 30)

const FIRST_NAME = obj.functions.generateName()
const LAST_NAME = obj.functions.generateName()
const COMPANY_NAME = `${obj.functions.generateName()} Company`

web.transaction('Create new lead')
web.waitForVisible(obj.home.nav.leads)

web.execute(() => {
    getElementByXPath = (xpath) => {
        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
    }
    getElementByXPath('//a[@href="/lightning/o/Lead/home"]').click()
})

// new lead
web.pause(2500)
web.waitForVisible(obj.utils.newBtn)
obj.click(obj.utils.newBtn)

web.waitForVisible('//div[@class="isModal inlinePanel oneRecordActionWrapper"]')
obj.click(obj.utils.nextBtn)

web.pause(1500)
obj.type(obj.leads.newLead.firstName, FIRST_NAME)
web.pause(1500)
obj.type(obj.leads.newLead.lastName, LAST_NAME)
web.pause(1500)
obj.type(obj.leads.newLead.company, COMPANY_NAME)
web.pause(1500)

web.waitForVisible(obj.utils.save)
obj.click(obj.utils.save)
web.pause(2500)

web.transaction('Assert created lead')
const createdLead = `//lightning-formatted-name[contains(text(), "${FIRST_NAME} ${LAST_NAME}")]`
web.waitForVisible(createdLead)
if (!web.isExist(createdLead)) {
    assert.fail('The lead was not created')
}

web.transaction('Delete the new lead')
web.waitForVisible(obj.home.nav.leads)

web.execute(() => {
    getElementByXPath = (xpath) => {
        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
    }
    getElementByXPath('//a[@href="/lightning/o/Lead/home"]').click()
})

obj.click(`//a[@title="${FIRST_NAME} ${LAST_NAME}"]//..//..//..//span[contains(text(), "Show Actions")]`)

web.pause(1500)
web.waitForVisible('//div[@title="Delete"]')
obj.click('//div[@title="Delete"]')

web.pause(1500)
web.waitForVisible(obj.utils.popUpDeleteBtn)
obj.click(obj.utils.popUpDeleteBtn)

web.pause(1500)
web.dispose()