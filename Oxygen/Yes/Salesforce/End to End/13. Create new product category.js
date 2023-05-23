const obj = po
obj.init(env.url, 30)

const utils = obj.utils
const productCategories = obj.productCategories
const PRODUCT = `${obj.functions.generateName().toUpperCase()} Category`

web.transaction('Navigate to Product Categories')
web.waitForVisible(obj.home.nav.productCategories)

web.execute(() => {
    getElementByXPath = (xpath) => {
        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
    }
    getElementByXPath('//a[@href="/lightning/o/Product_Categories__c/home"]').click()
})


web.transaction('New Product Category')
web.waitForVisible(utils.newBtn)
obj.click(utils.newBtn)

web.waitForVisible(productCategories.nameField)
obj.type(productCategories.nameField, PRODUCT)
web.pause(2500)

obj.click(productCategories.handlingCompanyBtn)
web.pause(2500)

obj.click(productCategories.handlingCompanies.yes)
web.pause(2500)

const selectedCompany = web.getText(productCategories.handlingCompanyBtn)

obj.click(obj.utils.save)

web.transaction('Assert Created Category')
const createdHeader = web.getText(
    '//slot[@slot="primaryField"]/lightning-formatted-text'
)
const createdName = web.getText(
    '//span[contains(text(), "Category Name")]//..//..//lightning-formatted-text[@data-output-element-id="output-field"]'
)
const createdHandlingCompany = web.getText(
    '//span[contains(text(), "Handling Company")]//..//..//lightning-formatted-text[@data-output-element-id="output-field"]'
)

log.info('Header: ' + createdHeader)
log.info('Name: ' + createdName)
log.info('Handling Company: ' + createdHandlingCompany)

if (!createdHeader.includes(PRODUCT) 
   || !createdName.includes(PRODUCT)) {
       assert.fail(`${PRODUCT} was not created`) 
} else {
    if (!createdHandlingCompany.includes(selectedCompany)) {
        assert.fail(`${selectedCompany} was not created`)
    } else {
        web.transaction('Delete Created Category')
        obj.click(utils.showMoreActions)
        web.pause(2500)

        obj.click(utils.moreActions_delete)
        obj.functions.confirmDelete()

        const message = obj.functions.getGreenMessage()
        if (message.includes(`Product Categories "${PRODUCT}" was deleted.`)) {
            log.info(message)
        } else {
            log.info(`${PRODUCT} was not deleted`)
        }
    }
}