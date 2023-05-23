const obj = po
obj.init(env.url, 30)

const func = obj.functions
const reports = obj.reports

const ACCOUT_NAME = `${func.generateName()} Account` 

function deleteReport(name) {
    let trigger = '//..//..//..//..//..//..//lightning-button-menu[contains(@class, "slds-dropdown-trigger_click")]'
    obj.click(`(//a[contains(text(), "${name}")]${trigger})[1]`)
    web.pause(2500)
    obj.click('//span[text()="Delete"]')
    web.pause(2500)
    web.waitForVisible(obj.utils.popUpDeleteBtn)
    obj.click(obj.utils.popUpDeleteBtn)
    web.pause(2500)
}

// need at least 1 account available
web.transaction('Create New Report')
func.createAccount(ACCOUT_NAME)

web.transaction('Create New Report')
web.waitForVisible(obj.home.nav.reports)

web.execute(() => {
    getElementByXPath = (xpath) => {
        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
    }
    getElementByXPath('//a[@href="/lightning/o/Report/home"]').click()
})

obj.click(reports.newReport)
web.selectFrame(reports.frame)
web.waitForVisible('//footer[@class="slds-modal__footer"]')

web.pause(3000)
web.pointJS(reports.continueBtn)
obj.click(reports.continueBtn)
obj.click(reports.run)

web.transaction('Assert Reports Table and Save')
web.waitForVisible('//div[@class="table-with-search-wrapper"]')

var accounts = web.getElementCount('//div[contains(@data-tooltip, "Account")]')
if (accounts < 1) {
    log.info('There are no accounts available')
} else {
    for (let x = 1; x <= accounts; x++) {
        if (!web.getText(`(//div[contains(@data-tooltip, "Account")])[${x}]`) === ACCOUT_NAME) {
            log.info(`${ACCOUT_NAME} is not available`)
        } else {
            obj.click(reports.moreActionsArrow)
            obj.click(reports.moreActions.saveBtn)

            var reportName = web.getValue(reports.save.nameInput)
            obj.click(reports.save.saveBtn)
            log.info(`Report name: ${reportName}`)

            web.transaction('Delete Report Table')
            web.waitForVisible('//div[contains(@class, "name-title")]')
            if (!web.isVisible(`//span[@title="${reportName}"]`)) {
                assert.fail(`${reportName} was not created`)
            } else {
                web.pause(3000)
                web.execute(() => {
                    getElementByXPath = (xpath) => {
                        return document.evaluate(
                            xpath,
                            document,
                            null, 
                            XPathResult.FIRST_ORDERED_NODE_TYPE, 
                            null
                        ).singleNodeValue
                    }
                    getElementByXPath('//a[@href="/lightning/o/Report/home"]').click()
                })
                deleteReport(reportName)
                web.dispose()
                break
            }
        }
    }
}