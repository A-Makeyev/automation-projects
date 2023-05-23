const obj = po
obj.init(env.url, 30)

currentDate = () => {
    let today = new Date()
    let dd = String(today.getDate()).padStart(2, "0")
    let mm = String(today.getMonth() + 1).padStart(2, "0")
    let yyyy = today.getFullYear()
    return `${dd}/${mm}/${yyyy}`
}

getDay = (date) => {
    let day = date.slice(0, 2)
    day = day < 10 ? day.substr(1) : day
    return day
}

var thisDay = getDay(currentDate())

const ACCOUNT_NAME = `${obj.functions.generateName()} Account`
const OPPORTUNITY_NAME = `${obj.functions.generateName()} Opportunity`

web.transaction('Create new billing acount')
obj.functions.createAccount(ACCOUNT_NAME)

web.transaction('Create new opportunity')
web.waitForVisible(obj.home.nav.opportunity)

web.execute(() => {
    getElementByXPath = (xpath) => {
        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
    }
    getElementByXPath('//a[@href="/lightning/o/Opportunity/home"]').click()
})


// new opportunity
web.pause(2500)
web.waitForVisible(obj.utils.newBtn)
obj.click(obj.utils.newBtn)
web.pause(5000)

web.waitForVisible(obj.opportunities.newOpportunity.name)
obj.type(obj.opportunities.newOpportunity.name, OPPORTUNITY_NAME)

web.waitForVisible(obj.opportunities.newOpportunity.accountName)
obj.type(obj.opportunities.newOpportunity.accountName, ACCOUNT_NAME)

web.pause(2500)
web.waitForVisible(`//div[@title="${ACCOUNT_NAME}"]`)
obj.click(`//div[@title="${ACCOUNT_NAME}"]`)

// close date
web.waitForVisible(obj.opportunities.newOpportunity.closeDate)
obj.click(obj.opportunities.newOpportunity.closeDate)
web.pause(2500)

web.waitForVisible(`//span[contains(@class, "todayDate selectedDate") and text()="${thisDay}"]`)
obj.click(`//span[contains(@class, "todayDate selectedDate") and text()="${thisDay}"]`)

// stage
web.waitForVisible(obj.opportunities.newOpportunity.stageBtn)
obj.click(obj.opportunities.newOpportunity.stageBtn)
web.pause(2500)

web.waitForVisible(obj.opportunities.newOpportunity.stage.proposal)
web.pause(2500)

obj.click(obj.opportunities.newOpportunity.stage.proposal)
obj.click(obj.utils.save)
web.pause(2500)


web.transaction('Assert created opportunity')
const createdOpportunity = `//slot[@slot="primaryField"]/lightning-formatted-text[contains(text(), "${OPPORTUNITY_NAME}")]`
web.waitForVisible(createdOpportunity)

if (!web.isExist(createdOpportunity)) {
    assert.fail('The opportunity was not created')
}

web.transaction('Delete the new opportunity')
web.waitForVisible(obj.utils.deleteBtn)
obj.click(obj.utils.deleteBtn)

web.waitForVisible(obj.utils.popUpDeleteBtn)
obj.click(obj.utils.popUpDeleteBtn)
web.pause(2500)
web.dispose()