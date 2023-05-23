const obj = po
obj.init(env.url, 30)

const utils = obj.utils
const enrollment = obj.enrollment
const ENROLLMENT_NAME = `${obj.functions.generateName().toUpperCase()} Enrollment`

function deleteEnrollment() {
    obj.click(utils.showMoreActions)
    web.pause(2500)

    obj.click(utils.moreActions_delete)
    obj.functions.confirmDelete()

    const message = obj.functions.getGreenMessage()
    if (message.includes(`Enrollment "${ENROLLMENT_NAME}" was deleted.`)) {
        log.info(message)
    } else {
        log.info(`${ENROLLMENT_NAME} was not deleted`)
    }
}

web.transaction('Navigate to Enrollment')
web.waitForVisible(obj.home.nav.enrollment)

web.execute(() => {
    getElementByXPath = (xpath) => {
        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
    }
    getElementByXPath('//a[@href="/lightning/o/Enrollment__c/home"]').click()
})


web.transaction('New Enrollment Details')
web.waitForVisible(utils.newBtn)
obj.click(utils.newBtn)

web.waitForVisible(enrollment.nameField)
obj.type(enrollment.nameField, ENROLLMENT_NAME)
web.pause(2500)

obj.click(enrollment.queueTypeBtn)
web.pause(2500)

obj.click(enrollment.queueTypes.middle)
web.pause(2500)

const selectedQueue = web.getText(enrollment.queueTypeBtn)

obj.click(obj.utils.save)

web.transaction('Assert Created Enrollment')
const createdHeader = web.getText(
    '//slot[@slot="primaryField"]/lightning-formatted-text'
)
const createdName = web.getText(
    '//span[contains(text(), "Enrollment Name")]//..//..//lightning-formatted-text[@data-output-element-id="output-field"]'
)
const createdQueue = web.getText(
    '//span[contains(text(), "Queue Type")]//..//..//lightning-formatted-text[@data-output-element-id="output-field"]'
)

log.info('Header: ' + createdHeader)
log.info('Name: ' + createdName)
log.info('Queue: ' + createdQueue)

if (!createdHeader.includes(ENROLLMENT_NAME) 
   || !createdName.includes(ENROLLMENT_NAME)) {
       assert.fail(`${ENROLLMENT_NAME} was not created`) 
} else {
    if (!createdQueue.includes(selectedQueue)) {
        assert.fail(`${selectedQueue} was not created`)
    } else {
        web.transaction('Delete Created Enrollment')
        deleteEnrollment()
        assert.pass()
    }
}